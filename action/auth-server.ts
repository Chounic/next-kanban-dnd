"use server";

import bcrypt from "bcryptjs";
import { findUserByEmail } from "./users-server";
import { db } from "@/lib/kysely";
import { authFormSchema, AuthFormSchema } from "@/lib/zod-validations";
import { CustomError, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

//TODO revoir l'affichage des erreurs

export const signUp = async (formData: AuthFormSchema) => {
  const validatedFields = authFormSchema.safeParse({
    email: formData.email as string,
    password: formData.password as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "L'inscription a échoué. Veuillez vérifier les champs.",
    };
  }

  try {
    const existingUser = await findUserByEmail(validatedFields.data.email);

    if (existingUser) {
      return {
        error:
          "Visiblement, cette adresse email est déjà utilisée. Essayez de vous connecter, ou saisissez une autre adresse email.",
      };
    }

    const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);
    await db
      .insertInto("User")
      .values({
        email: validatedFields.data.email,
        password: hashedPassword,
      })
      .executeTakeFirst();

    return {
      success: "Vous êtes maintenant inscrit. Connectez-vous à votre compte.",
    };
  } catch (error) {
    return { error: `Échec de l'inscription` };
  }
};

export const login = async (formData: AuthFormSchema) => {
  const validatedFields = authFormSchema.safeParse({
    email: formData.email as string,
    password: formData.password as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "La connexion a échoué. Veuillez vérifier les champs.",
    };
  }

  //redirect handled client side cause not working in try/catch
  try {
    const result = await signIn("credentials", {
      redirect: false,
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    });

    if (result.error) {
      return { error: result.error };
    } else return { success: "Vous êtes connecté(e) à votre compte." };
  } catch (error) {
    if (error instanceof CustomError) {
      console.log("🚀 ~typeof login ~ error.message:", error.message);
      return { error: error.message };
    }
    return { error: "La connection a échouée." };
  }
};

export const logout = async () => {
  try {
    await signOut();
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Échec de la déconnexion" };
    } else return { success: "Vous êtes déconnecté(e)." };
  }
};
