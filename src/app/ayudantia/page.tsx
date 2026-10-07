import { redirect } from "next/navigation";

export default function AyudantiaRedirectPage() {
  redirect("/?role=student");
}
