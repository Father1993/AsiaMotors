ALTER TABLE cars ADD COLUMN availability text;
UPDATE cars SET availability = CASE WHEN available THEN 'in_stock' ELSE 'on_order' END;
ALTER TABLE cars ALTER COLUMN availability SET NOT NULL;
ALTER TABLE cars ADD CONSTRAINT cars_availability_valid
    CHECK (availability IN ('in_stock', 'in_china', 'on_order'));

-- Keep the previous web image writable during deployment and rollback.
-- New writers set availability; old writers only know available.
CREATE FUNCTION sync_car_availability() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.availability IS NULL THEN
            NEW.availability := CASE WHEN NEW.available THEN 'in_stock' ELSE 'on_order' END;
        END IF;
    ELSIF NEW.availability IS NOT DISTINCT FROM OLD.availability
          AND NEW.available IS DISTINCT FROM OLD.available THEN
        NEW.availability := CASE WHEN NEW.available THEN 'in_stock' ELSE 'on_order' END;
    END IF;
    NEW.available := NEW.availability <> 'on_order';
    RETURN NEW;
END;
$$;
CREATE TRIGGER cars_sync_availability BEFORE INSERT OR UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION sync_car_availability();
ALTER TABLE cars ADD CONSTRAINT cars_availability_consistent
    CHECK (available = (availability <> 'on_order'));
