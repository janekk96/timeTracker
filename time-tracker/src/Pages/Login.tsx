import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../consts/supabase";

function Login() {
  return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
}
export default Login;
