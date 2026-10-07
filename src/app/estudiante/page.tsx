import { redirect } from "next/navigation";

export default function EstudianteRedirectPage() {
  redirect("/?role=student");
}
