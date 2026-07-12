-- AssetFlow PostgreSQL Enterprise Database Schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Function: Trigger to set updated_at and increment version for Optimistic Locking
CREATE OR REPLACE FUNCTION trigger_set_timestamp_and_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. IDENTITY & ACCESS MANAGEMENT (RBAC)

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES users(id)
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES users(id)
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (resource_name, action)
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- 2. ORGANIZATION STRUCTURE

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES users(id)
);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    location_id UUID REFERENCES locations(id),
    manager_id UUID REFERENCES users(id),
    parent_department_id UUID REFERENCES departments(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES users(id)
);

CREATE TABLE user_departments (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, department_id)
);

-- 3. ASSET MANAGEMENT

CREATE TABLE asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    parent_category_id UUID REFERENCES asset_categories(id),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES users(id)
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    tag_number VARCHAR(100) UNIQUE NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    category_id UUID REFERENCES asset_categories(id) NOT NULL,
    department_id UUID REFERENCES departments(id) NOT NULL,
    location_id UUID REFERENCES locations(id) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed')),
    purchase_date DATE,
    purchase_cost NUMERIC(12, 2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES users(id)
);
CREATE INDEX idx_assets_status ON assets(status) WHERE NOT is_deleted;
CREATE INDEX idx_assets_department ON assets(department_id) WHERE NOT is_deleted;

CREATE TABLE asset_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) NOT NULL,
    allocated_to UUID REFERENCES users(id) NOT NULL,
    allocated_by UUID REFERENCES users(id) NOT NULL,
    allocation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMPTZ,
    expected_return_date TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Returned', 'Overdue')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1
);
CREATE INDEX idx_allocations_active ON asset_allocations(asset_id, status) WHERE status = 'Active';

CREATE TABLE asset_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) NOT NULL,
    from_department_id UUID REFERENCES departments(id) NOT NULL,
    to_department_id UUID REFERENCES departments(id) NOT NULL,
    requested_by UUID REFERENCES users(id) NOT NULL,
    approved_by UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Completed')),
    transfer_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1
);

CREATE TABLE asset_maintenances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) NOT NULL,
    technician_id UUID REFERENCES users(id),
    reported_by UUID REFERENCES users(id) NOT NULL,
    issue_description TEXT NOT NULL,
    maintenance_cost NUMERIC(12, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending Approval' CHECK (status IN ('Pending Approval', 'In Progress', 'Resolved', 'Unresolvable')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1
);

CREATE TABLE asset_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id),
    auditor_id UUID REFERENCES users(id) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1
);

CREATE TABLE asset_audit_items (
    audit_id UUID REFERENCES asset_audits(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Found', 'Missing', 'Damaged')),
    notes TEXT,
    PRIMARY KEY (audit_id, asset_id)
);

-- 4. RESOURCE BOOKINGS (Meeting Rooms, Vehicles, etc)

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('Meeting Room', 'Vehicle', 'Projector', 'Conference Room', 'Equipment')),
    location_id UUID REFERENCES locations(id) NOT NULL,
    capacity INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Under Maintenance', 'Retired')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES users(id)
);

CREATE TABLE resource_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) NOT NULL,
    booked_by UUID REFERENCES users(id) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')),
    purpose TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    CONSTRAINT chk_booking_dates CHECK (end_time > start_time),
    -- btree_gist extension allows this EXCLUDE constraint for overlap prevention
    EXCLUDE USING gist (
        resource_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    ) WHERE (status IN ('Pending', 'Confirmed'))
);

-- 5. AUDIT & SYSTEM

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('INSERT', 'UPDATE', 'DELETE', 'SOFT_DELETE')),
    old_value JSONB,
    new_value JSONB,
    performed_by UUID REFERENCES users(id),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_logs_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_performed_by ON audit_logs(performed_by);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TRIGGERS
CREATE TRIGGER trg_users_upd BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();
CREATE TRIGGER trg_roles_upd BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();
CREATE TRIGGER trg_locations_upd BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();
CREATE TRIGGER trg_departments_upd BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();
CREATE TRIGGER trg_asset_categories_upd BEFORE UPDATE ON asset_categories FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();
CREATE TRIGGER trg_assets_upd BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();
CREATE TRIGGER trg_asset_allocations_upd BEFORE UPDATE ON asset_allocations FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();
CREATE TRIGGER trg_asset_transfers_upd BEFORE UPDATE ON asset_transfers FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();
CREATE TRIGGER trg_asset_maintenances_upd BEFORE UPDATE ON asset_maintenances FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();
CREATE TRIGGER trg_asset_audits_upd BEFORE UPDATE ON asset_audits FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();
CREATE TRIGGER trg_resources_upd BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();
CREATE TRIGGER trg_resource_bookings_upd BEFORE UPDATE ON resource_bookings FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_and_version();

-- STORED PROCEDURES (TRANSACTIONS)

-- 1. Allocate Asset
CREATE OR REPLACE PROCEDURE allocate_asset(
    p_asset_id UUID,
    p_allocated_to UUID,
    p_allocated_by UUID,
    p_expected_return_date TIMESTAMPTZ,
    p_notes TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_status VARCHAR;
BEGIN
    -- Optimistic locking implicitly handled by FOR UPDATE
    SELECT status INTO v_status FROM assets WHERE id = p_asset_id FOR UPDATE;
    
    IF v_status != 'Available' THEN
        RAISE EXCEPTION 'Asset is not available for allocation. Current status: %', v_status;
    END IF;
    
    UPDATE assets SET status = 'Allocated', updated_at = CURRENT_TIMESTAMP WHERE id = p_asset_id;
    
    INSERT INTO asset_allocations (asset_id, allocated_to, allocated_by, expected_return_date, notes)
    VALUES (p_asset_id, p_allocated_to, p_allocated_by, p_expected_return_date, p_notes);
END;
$$;

-- 2. Approve Transfer
CREATE OR REPLACE PROCEDURE approve_transfer(
    p_transfer_id UUID,
    p_approved_by UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_asset_id UUID;
    v_to_dept UUID;
    v_status VARCHAR;
BEGIN
    SELECT asset_id, to_department_id, status INTO v_asset_id, v_to_dept, v_status 
    FROM asset_transfers WHERE id = p_transfer_id FOR UPDATE;
    
    IF v_status != 'Pending' THEN
        RAISE EXCEPTION 'Transfer request is not pending.';
    END IF;
    
    UPDATE asset_transfers 
    SET status = 'Approved', approved_by = p_approved_by, transfer_date = CURRENT_TIMESTAMP 
    WHERE id = p_transfer_id;
    
    UPDATE assets 
    SET department_id = v_to_dept, updated_at = CURRENT_TIMESTAMP 
    WHERE id = v_asset_id;
END;
$$;

-- 3. Resolve Maintenance
CREATE OR REPLACE PROCEDURE resolve_maintenance(
    p_maintenance_id UUID,
    p_cost NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_asset_id UUID;
    v_status VARCHAR;
BEGIN
    SELECT asset_id, status INTO v_asset_id, v_status 
    FROM asset_maintenances WHERE id = p_maintenance_id FOR UPDATE;
    
    IF v_status != 'In Progress' THEN
        RAISE EXCEPTION 'Maintenance is not in progress.';
    END IF;
    
    UPDATE asset_maintenances 
    SET status = 'Resolved', maintenance_cost = p_cost, end_date = CURRENT_TIMESTAMP 
    WHERE id = p_maintenance_id;
    
    UPDATE assets 
    SET status = 'Available', updated_at = CURRENT_TIMESTAMP 
    WHERE id = v_asset_id;
END;
$$;
