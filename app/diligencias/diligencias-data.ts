export interface DiligenciaData {
  id?: string;
  titulo: string;
  tipo: string[];
  descripcion: string;
}

// Datos de ejemplo para las diligencias
export const diligenciasData: DiligenciaData[] = [
  {
    titulo: "Diligencia de Archivo",
    tipo: ["Archivo"],
    descripcion: "Diligencia para el archivo de actuaciones"
  },
  {
    id: "2",
    titulo: "Carátula (Archivo)",
    tipo: ["Archivo", "Carátula"],
    descripcion: "Carátula para procedimientos de archivo"
  },
  {
    id: "3",
    titulo: "Diligencia de aviso letrado (detenido)",
    tipo: ["Letrado", "Aviso"],
    descripcion: "Aviso al letrado de persona detenida"
  },
  {
    id: "4",
    titulo: "Diligencia de información de derechos y de los elementos esenciales de las actuaciones para impugnar la detención",
    tipo: ["Detenido", "Derechos"],
    descripcion: "Información de derechos del detenido"
  },
  {
    id: "5",
    titulo: "Diligencia de aviso a familiar o persona designada",
    tipo: ["Detenido", "Aviso"],
    descripcion: "Aviso a familiar del detenido"
  },
  {
    id: "6",
    titulo: "Diligencia de aviso a Autoridad Judicial",
    tipo: ["Aviso"],
    descripcion: "Comunicación a la autoridad judicial"
  },
  {
    id: "7",
    titulo: "Diligencia de Derechos delitos violentos/sexuales",
    tipo: ["Sexual", "Derechos"],
    descripcion: "Derechos específicos para delitos violentos o sexuales"
  },
  {
    id: "8",
    titulo: "Diligencia de Solicitud medios telemáticos (VIOGEN)",
    tipo: ["VIOGEN"],
    descripcion: "Solicitud de medios telemáticos del sistema VIOGEN"
  },
  {
    id: "9",
    titulo: "Diligencia de Manifestación detenido/investigado",
    tipo: ["Detenido", "Manifestacion"],
    descripcion: "Manifestación del detenido o investigado"
  },
  {
    id: "10",
    titulo: "Diligencia de entrega de Plan de Seguridad",
    tipo: ["VIOGEN"],
    descripcion: "Entrega del plan de seguridad a la víctima"
  },
  {
    id: "11",
    titulo: "Anexo",
    tipo: ["Anexo"],
    descripcion: "Documentación anexa al procedimiento"
  },
  {
    id: "12",
    titulo: "Diligencia resumen",
    tipo: ["JRDL", "JRSD", "JRD"],
    descripcion: "Resumen de las actuaciones realizadas"
  },
  {
    id: "13",
    titulo: "Diligencia haciendo constar renuncia del perjudicado a llevar a cabo acciones penales",
    tipo: ["Renuncia", "VIOGEN", "VIODOM"],
    descripcion: "Renuncia del perjudicado a acciones penales"
  },
  {
    id: "14",
    titulo: "Dispensa de Denunciar",
    tipo: ["Dispensa"],
    descripcion: "Dispensa del deber de denunciar"
  },
  {
    id: "15",
    titulo: "Derechos víctima VIOGEN",
    tipo: ["VIOGEN", "Derechos"],
    descripcion: "Derechos específicos de víctimas en el sistema VIOGEN"
  },
  {
    id: "16",
    titulo: "Diligencia haciendo constar resultado de la valoración policial de RIESGO",
    tipo: ["VIOGEN"],
    descripcion: "Resultado de la valoración policial de riesgo"
  },
  {
    id: "17",
    titulo: "Diligencia informando a la víctima del derecho de acceso a una vivienda de acogida",
    tipo: ["VIOGEN", "Derechos"],
    descripcion: "Información sobre derecho a vivienda de acogida"
  },
  {
    id: "18",
    titulo: "Diligencia dirigida a FISCALÍA proponiendo solicitud a la autoridad judicial de Instalación de dispositivo telemático control",
    tipo: ["VIOGEN"],
    descripcion: "Propuesta de dispositivo telemático de control"
  },
  {
    id: "19",
    titulo: "Diligencia de antecedentes del Sistema de Registro Integral de Seguimiento de Víctimas de Violencia de Género",
    tipo: ["VIOGEN", "Antecedentes"],
    descripcion: "Antecedentes del sistema de seguimiento de víctimas"
  },
  {
    id: "20",
    titulo: "Diligencia informando a la víctima de caso con autor persistente",
    tipo: ["VIOGEN"],
    descripcion: "Información sobre casos con autor persistente"
  },
  {
    id: "21",
    titulo: "Diligencia describiendo lesiones de la víctima",
    tipo: ["Lesiones"],
    descripcion: "Descripción detallada de las lesiones de la víctima"
  },
  {
    id: "22",
    titulo: "Diligencia haciendo constar consulta en Intervención Central de Armas y Explosivos",
    tipo: ["Consulta"],
    descripcion: "Consulta en base de datos de armas y explosivos"
  },
  {
    id: "23",
    titulo: "Consentimiento de la víctma para subir su fotografía al Sistema VIOGEN",
    tipo: ["VIOGEN"],
    descripcion: "Consentimiento para fotografía en sistema VIOGEN"
  },
  {
    id: "24",
    titulo: "Carátula (Traspaso)",
    tipo: ["Traspaso", "Carátula"],
    descripcion: "Carátula para procedimientos de traspaso"
  },
  {
    id: "25",
    titulo: "Acta de información de derechos a persona víctima de un delito",
    tipo: ["Derechos"],
    descripcion: "Acta informativa de derechos de la víctima"
  },
  {
    id: "26",
    titulo: "Diligencia haciendo constar situación administrativa de la víctima extranjera",
    tipo: ["Extranjero"],
    descripcion: "Situación administrativa de víctima extranjera"
  },
  {
    id: "27",
    titulo: "Diligencia haciendo constar situación administrativa del autor extranjero",
    tipo: ["Extranjero"],
    descripcion: "Situación administrativa de autor extranjero"
  },
  {
    id: "28",
    titulo: "Diligencia de remisión/entrega de atestado",
    tipo: ["Remisiones"],
    descripcion: "Remisión o entrega del atestado policial"
  },
  {
    id: "29",
    titulo: "Diligencia de traspaso",
    tipo: ["Traspaso"],
    descripcion: "Traspaso de competencias o procedimiento"
  },
  {
    id: "30",
    titulo: "Diligencia de lectura de derechos investigado no detenido",
    tipo: ["Investigado", "Derechos"],
    descripcion: "Lectura de derechos a investigado no detenido"
  },
  {
    id: "31",
    titulo: "Carátula",
    tipo: ["Carátula"],
    descripcion: "Carátula general del procedimiento"
  }
];