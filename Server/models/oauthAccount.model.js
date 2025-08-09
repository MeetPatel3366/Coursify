import { model, Schema } from "mongoose";

const oauthAccountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["google", "github"],
      required: true,
    },
    providerAccountId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const OauthAccount = model("OauthAccount", oauthAccountSchema);

export default OauthAccount;
