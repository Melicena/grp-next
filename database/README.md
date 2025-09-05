# Row-Level Security (RLS) Setup

Este directorio contiene los archivos necesarios para configurar la seguridad a nivel de fila en Supabase.

## 📋 Archivos

- `rls-policies.sql` - Políticas de seguridad RLS para todas las tablas

## 🚀 Instrucciones de Implementación

### Paso 1: Acceder a Supabase Dashboard

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Navega a **SQL Editor** en el menú lateral

### Paso 2: Ejecutar las Políticas RLS

1. Abre el archivo `rls-policies.sql`
2. Copia todo el contenido del archivo
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **Run** para ejecutar las políticas

### Paso 3: Verificar la Implementación

#### Verificar que RLS está habilitado:
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('entidades_dgs', 'entidades_personas', 'entidades_letrados');
```

#### Verificar las políticas creadas:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('entidades_dgs', 'entidades_personas', 'entidades_letrados');
```

## 🔒 Políticas Implementadas

### Para cada tabla (`entidades_dgs`, `entidades_personas`, `entidades_letrados`):

| Operación | Política | Descripción |
|-----------|----------|-------------|
| **SELECT** | `Users can view own [tabla]` | Los usuarios solo pueden ver sus propios registros |
| **INSERT** | `Users can insert own [tabla]` | Los usuarios pueden insertar registros (con su propio ID) |
| **UPDATE** | `Users can update own [tabla]` | Los usuarios solo pueden actualizar sus propios registros |
| **DELETE** | `Users can delete own [tabla]` | Los usuarios solo pueden eliminar sus propios registros |

## 🧪 Testing

### Probar con diferentes usuarios:

1. **Crear usuario de prueba:**
   ```sql
   -- En Authentication > Users, crea un nuevo usuario
   ```

2. **Insertar datos de prueba:**
   ```sql
   -- Desde la aplicación, inserta algunos registros con diferentes usuarios
   ```

3. **Verificar aislamiento:**
   ```sql
   -- Cada usuario debería ver solo sus propios datos
   SELECT * FROM entidades_personas;
   ```

## ⚠️ Consideraciones Importantes

### Tipo de Datos de la Columna `usuario`

- **Si es UUID:** `auth.uid() = usuario`
- **Si es TEXT:** `auth.uid()::text = usuario`

### Verificar Tipo de Columna
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'entidades_personas' 
AND column_name = 'usuario';
```

### Modificar Políticas si es Necesario

Si la columna `usuario` es de tipo TEXT, modifica las políticas:

```sql
-- Ejemplo para tipo TEXT
DROP POLICY "Users can view own entidades_personas" ON entidades_personas;

CREATE POLICY "Users can view own entidades_personas" ON entidades_personas
    FOR SELECT USING (auth.uid()::text = usuario);
```

## 🔧 Troubleshooting

### Error: "new row violates row-level security policy"
- Verifica que la columna `usuario` se esté poblando correctamente
- Confirma que `auth.uid()` no sea NULL
- Revisa el tipo de datos de la columna `usuario`

### Error: "permission denied for table"
- Verifica que las políticas estén creadas correctamente
- Confirma que RLS esté habilitado en la tabla
- Revisa que el usuario esté autenticado

### Logs de Depuración
```sql
-- Ver el UUID del usuario actual
SELECT auth.uid();

-- Ver registros con información de usuario
SELECT id, nombre, usuario, auth.uid() as current_user 
FROM entidades_personas;
```

## 📚 Recursos Adicionales

- [Documentación oficial de RLS en Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)