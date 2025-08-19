-- Script para configurar permisos de AdminPurchases
-- Este script agrega los permisos necesarios para que admin y empleados 
-- puedan usar la página de gestión de pedidos

-- 1. Agregar las nuevas acciones de seguridad (solo si no existen)
INSERT INTO security_actions (id, security_route, security_method, description) 
SELECT 27, '/orders/all', 'get', 'Ver todas las compras'
WHERE NOT EXISTS (SELECT 1 FROM security_actions WHERE id = 27);

INSERT INTO security_actions (id, security_route, security_method, description) 
SELECT 28, '/orders/all/detail/:id', 'get', 'Ver detalle de cualquier compra'
WHERE NOT EXISTS (SELECT 1 FROM security_actions WHERE id = 28);

INSERT INTO security_actions (id, security_route, security_method, description) 
SELECT 29, '/orders/:id/status', 'put', 'Actualizar estado de pedido'
WHERE NOT EXISTS (SELECT 1 FROM security_actions WHERE id = 29);

-- 2. Asignar permisos a Admin (user_type_id = 3)
INSERT INTO security_actions_roles (user_type_id, security_action_id) 
SELECT 3, 27 WHERE NOT EXISTS (SELECT 1 FROM security_actions_roles WHERE user_type_id = 3 AND security_action_id = 27);

INSERT INTO security_actions_roles (user_type_id, security_action_id) 
SELECT 3, 28 WHERE NOT EXISTS (SELECT 1 FROM security_actions_roles WHERE user_type_id = 3 AND security_action_id = 28);

INSERT INTO security_actions_roles (user_type_id, security_action_id) 
SELECT 3, 29 WHERE NOT EXISTS (SELECT 1 FROM security_actions_roles WHERE user_type_id = 3 AND security_action_id = 29);

-- 3. Asignar permisos a Empleado (user_type_id = 2)
INSERT INTO security_actions_roles (user_type_id, security_action_id) 
SELECT 2, 27 WHERE NOT EXISTS (SELECT 1 FROM security_actions_roles WHERE user_type_id = 2 AND security_action_id = 27);

INSERT INTO security_actions_roles (user_type_id, security_action_id) 
SELECT 2, 28 WHERE NOT EXISTS (SELECT 1 FROM security_actions_roles WHERE user_type_id = 2 AND security_action_id = 28);

INSERT INTO security_actions_roles (user_type_id, security_action_id) 
SELECT 2, 29 WHERE NOT EXISTS (SELECT 1 FROM security_actions_roles WHERE user_type_id = 2 AND security_action_id = 29);

-- Verificar que los permisos se agregaron correctamente
SELECT 'Permisos agregados correctamente' as status;
SELECT sa.id, sa.security_route, sa.security_method, sa.description 
FROM security_actions sa 
WHERE sa.id IN (27, 28, 29);

SELECT 'Roles asignados:' as info;
SELECT ut.name as role, sa.security_route, sa.security_method 
FROM security_actions_roles sar
JOIN user_type ut ON sar.user_type_id = ut.id
JOIN security_actions sa ON sar.security_action_id = sa.id
WHERE sa.id IN (27, 28, 29)
ORDER BY ut.name, sa.id;
