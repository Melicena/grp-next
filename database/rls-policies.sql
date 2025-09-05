-- Row-Level Security (RLS) Policies
-- Este archivo contiene las políticas de seguridad a nivel de fila para las tablas de la aplicación

-- =====================================================
-- HABILITAR RLS EN LAS TABLAS
-- =====================================================

-- Habilitar RLS en la tabla entidades_dgs
ALTER TABLE entidades_dgs ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en la tabla entidades_personas
ALTER TABLE entidades_personas ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en la tabla entidades_letrados (si existe)
ALTER TABLE entidades_letrados ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA TABLA: entidades_dgs
-- =====================================================

-- Política SELECT: Los usuarios pueden ver solo sus propios registros
CREATE POLICY "Users can view own entidades_dgs" ON entidades_dgs
    FOR SELECT USING (auth.uid() = usuario::uuid);

-- Política INSERT: Los usuarios pueden insertar registros
CREATE POLICY "Users can insert own entidades_dgs" ON entidades_dgs
    FOR INSERT WITH CHECK (auth.uid() = usuario::uuid);

-- Política UPDATE: Los usuarios pueden actualizar solo sus propios registros
CREATE POLICY "Users can update own entidades_dgs" ON entidades_dgs
    FOR UPDATE USING (auth.uid() = usuario::uuid)
    WITH CHECK (auth.uid() = usuario::uuid);

-- Política DELETE: Los usuarios pueden eliminar solo sus propios registros
CREATE POLICY "Users can delete own entidades_dgs" ON entidades_dgs
    FOR DELETE USING (auth.uid() = usuario::uuid);

-- =====================================================
-- POLÍTICAS PARA TABLA: entidades_personas
-- =====================================================

-- Política SELECT: Los usuarios pueden ver solo sus propios registros
CREATE POLICY "Users can view own entidades_personas" ON entidades_personas
    FOR SELECT USING (auth.uid() = usuario::uuid);

-- Política INSERT: Los usuarios pueden insertar registros
CREATE POLICY "Users can insert own entidades_personas" ON entidades_personas
    FOR INSERT WITH CHECK (auth.uid() = usuario::uuid);

-- Política UPDATE: Los usuarios pueden actualizar solo sus propios registros
CREATE POLICY "Users can update own entidades_personas" ON entidades_personas
    FOR UPDATE USING (auth.uid() = usuario::uuid)
    WITH CHECK (auth.uid() = usuario::uuid);

-- Política DELETE: Los usuarios pueden eliminar solo sus propios registros
CREATE POLICY "Users can delete own entidades_personas" ON entidades_personas
    FOR DELETE USING (auth.uid() = usuario::uuid);

-- =====================================================
-- POLÍTICAS PARA TABLA: entidades_letrados
-- =====================================================

-- Política SELECT: Los usuarios pueden ver solo sus propios registros
CREATE POLICY "Users can view own entidades_letrados" ON entidades_letrados
    FOR SELECT USING (auth.uid() = usuario::uuid);

-- Política INSERT: Los usuarios pueden insertar registros
CREATE POLICY "Users can insert own entidades_letrados" ON entidades_letrados
    FOR INSERT WITH CHECK (auth.uid() = usuario::uuid);

-- Política UPDATE: Los usuarios pueden actualizar solo sus propios registros
CREATE POLICY "Users can update own entidades_letrados" ON entidades_letrados
    FOR UPDATE USING (auth.uid() = usuario::uuid)
    WITH CHECK (auth.uid() = usuario::uuid);

-- Política DELETE: Los usuarios pueden eliminar solo sus propios registros
CREATE POLICY "Users can delete own entidades_letrados" ON entidades_letrados
    FOR DELETE USING (auth.uid() = usuario::uuid);

-- =====================================================
-- POLÍTICAS PARA TABLA: usuarios (si necesita RLS)
-- =====================================================

-- Si la tabla usuarios necesita RLS, descomenta las siguientes líneas:
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política SELECT: Los usuarios pueden ver solo su propio perfil
-- CREATE POLICY "Users can view own profile" ON usuarios
--     FOR SELECT USING (auth.uid() = id::uuid);

-- Política UPDATE: Los usuarios pueden actualizar solo su propio perfil
-- CREATE POLICY "Users can update own profile" ON usuarios
--     FOR UPDATE USING (auth.uid() = id::uuid)
--     WITH CHECK (auth.uid() = id::uuid);

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

/*
1. APLICACIÓN DE POLÍTICAS:
   - Ejecuta este script en el SQL Editor de Supabase
   - Las políticas se aplicarán inmediatamente
   - Verifica que la columna 'usuario' en cada tabla contenga el UUID del usuario

2. VERIFICACIÓN:
   - auth.uid() devuelve el UUID del usuario autenticado
   - La comparación se hace con la columna 'usuario' de cada tabla
   - Si la columna 'usuario' es de tipo TEXT, usa: auth.uid()::text = usuario
   - Si la columna 'usuario' es de tipo UUID, usa: auth.uid() = usuario

3. TESTING:
   - Prueba las políticas con diferentes usuarios
   - Verifica que cada usuario solo puede ver/editar sus propios datos
   - Confirma que las inserciones incluyen el usuario correcto

4. TROUBLESHOOTING:
   - Si hay errores, verifica el tipo de datos de la columna 'usuario'
   - Asegúrate de que auth.uid() no sea NULL (usuario autenticado)
   - Revisa los logs de Supabase para errores específicos
*/