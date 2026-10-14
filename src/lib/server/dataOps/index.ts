import { appealOps } from "./appealOps";
import { attendanceOps } from "./attendanceOps";
import { sectionOps } from "./sectionOps";
import { sessionOps } from "./sessionOps";
import { DataOp } from "./types";
import { visualOps } from "./visualOps";

/** Registro único de operaciones de datos. Para agregar una, definirla en su archivo y quedará disponible aquí. */
export const DATA_OPS: Record<string, DataOp> = {
  ...sectionOps,
  ...sessionOps,
  ...attendanceOps,
  ...appealOps,
  ...visualOps,
};
