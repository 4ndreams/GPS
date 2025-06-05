import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, CALLBACK_URL } from "../config/configEnv.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

// 📌 **Configuración de Facebook Login**
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: CALLBACK_URL,
  profileFields: ["id", "displayName", "emails"]
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;

    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOne({ where: { email } });

    if (!user) {
      user = await userRepository.save({ name, email, provider: "facebook" });
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;