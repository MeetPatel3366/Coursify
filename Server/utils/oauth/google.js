import { Google } from "arctic";
import { config } from "dotenv";
config();

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID, // This is your app's public ID that you get from Google cloud Console. It tells Google which app is trying to login
  process.env.GOOGLE_CLIENT_SECRET, // This is your app's secret key that should be kept private. It's used in the backend to prove that the login requset is legit and secure.
  `${process.env.GOOGLE_REDIRECT_URL}` // This is called the Redirect URI. we will create this route to verify after login. After a user logs in successfully with google, google will send them (and a special code) to this URL.(when user select the any email & then click on continue then go to this url)
);
