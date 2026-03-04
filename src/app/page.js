
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect root route to protected product page
  redirect("/product");
}
