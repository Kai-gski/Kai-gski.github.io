//axesHelper wurde als Objekt ausgelagert um einen Zentralen Ort aller Objekte zu erzeugen.
//Sollten weitere Objekte zum Canvas hinzukommen, sollen sie mit in \src\components\three\objects abgelegt werden

import { AxesHelper } from "three";
import { axesSize } from "../globalsSettings";

export const axesHelper = new AxesHelper( axesSize );