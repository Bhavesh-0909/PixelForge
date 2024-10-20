"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import Feedback from "../database/models/feedback.model";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS

// USE CREDITS
export async function updateCredits(clerkId: string, creditFee: number) {
  try {
    await connectToDatabase();
    const credit = creditFee/10;
    const updatedUserCredits = await User.findOneAndUpdate(
      { clerkId: clerkId }, // Query using clerkId, not _id
      { $inc: { creditBalance: credit } },
      { new: true }
    );

    if(!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}

export async function deductCredits(clerkId: string, creditFee: number) {
  try {
    await connectToDatabase();
    console.log("Deducting credits");
    const updatedUserCredits = await User.findOneAndUpdate(
      { clerkId: clerkId }, // Query using clerkId, not _id
      { $inc: { creditBalance: creditFee } },
      { new: true }
    );

    if(!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}

export async function addCreditPoints(email: string) {
  try {
    await connectToDatabase();
    const creditPoints = 10;
    const updatedUserCredits = await User.findOneAndUpdate(
      { email },
      { $inc: { creditBalance: creditPoints } },
      { new: true }
    );
    if (!updatedUserCredits) throw new Error("User credits update failed");

    return "Credit points added successfully to email: " + email;
  } catch (error) {
    handleError(error);
  }
}

export async function feedback(name: string, email: string, message: string) {
  try {
    await connectToDatabase();
    const feedback = new Feedback({ name, email, message });
    await feedback.save();
    return 'Feedback submitted successfully!';
  } catch (error) {
    handleError(error);
  }
}
