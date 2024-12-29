import jsonResponse from "./auth-services";
import db from "../db";
import { eq, or, and, asc } from "drizzle-orm";
import type { Exercise, TreatmentPlan } from "../../types";
import {
  appointments,
  exercises,
  treatment_plans,
  user_authentications,
} from "../schema";

export async function getTreatmentPlan(
  appointmentID: number,
  profile: {
    id: number;
    therapistID: number;
    staffID: number;
    patientID: number;
  }
) {
  const { id, patientID, therapistID, staffID } = profile;
  if (!id) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      401
    );
  }

  try {
    const treatmentPlanData = await db
      .select({
        planID: treatment_plans.planID,
        goals: treatment_plans.goals,
        startDate: treatment_plans.startDate,
        duration: treatment_plans.duration,
        frequency: treatment_plans.frequency,
        patientID: treatment_plans.patientID,
        therapistID: treatment_plans.therapistID,
        appointmentID: treatment_plans.appointmentID,
        staffID: appointments.staffID,
      })
      .from(treatment_plans)
      .innerJoin(
        appointments,
        eq(appointments.appointmentID, treatment_plans.appointmentID)
      )
      .where(
        and(
          eq(treatment_plans.appointmentID, appointmentID),
          or(
            eq(treatment_plans.patientID, patientID),
            eq(treatment_plans.therapistID, therapistID),
            eq(appointments.staffID, staffID)
          )
        )
      )
      .execute();
    console.log("length", treatmentPlanData.length);
    if (!treatmentPlanData.length) {
      return jsonResponse(
        { error: "No treatment plan found or access denied." },
        404
      );
    }
    console.log("treatmentPlant: ", treatmentPlanData);
    // Successful fetch
    return jsonResponse(treatmentPlanData[0], 200);
  } catch (error) {
    console.error(
      `Error fetching treatment plan for appointmentID: ${appointmentID}, userID: ${id}`,
      error
    );
    return jsonResponse(
      {
        error:
          "An unexpected error occurred while fetching the treatment plan.",
      },
      500
    );
  }
}

export async function createTreatmentPlan(
  reqBody: TreatmentPlan,
  appointmentID: number,
  profile: {
    id: number;
    therapistID: number;
  }
) {
  const { id, therapistID } = profile;
  if (!id && !therapistID) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      401
    );
  }
  try {
    const ids = await db
      .select({
        patientID: appointments.patientID,
        therapistID: appointments.therapistID,
      })
      .from(appointments)
      .where(eq(appointments.appointmentID, appointmentID))
      .execute();
    if (!ids.length) {
      return jsonResponse(
        { error: "No appointment found with the given ID" },
        404
      );
    }

    if (ids[0].therapistID !== therapistID) {
      return jsonResponse(
        {
          error:
            "You are not authorized to create a treatment plan for this appointment",
        },
        403
      );
    }

    // Validate reqBody
    if (!reqBody.goals || !reqBody.startDate) {
      return jsonResponse(
        {
          error: "Missing required fields: description, startDate",
        },
        400
      );
    }

    // Prevent duplicate treatment plans for the same appointment
    const existingPlan = await db
      .select({ planID: treatment_plans.planID })
      .from(treatment_plans)
      .where(eq(treatment_plans.appointmentID, appointmentID))
      .execute();

    if (existingPlan.length > 0) {
      return jsonResponse(
        { error: "A treatment plan already exists for this appointment" },
        409
      );
    }
    const treatmentPlanData = await db
      .insert(treatment_plans)
      .values({
        goals: reqBody.goals,
        startDate: reqBody.startDate,
        duration: reqBody.duration,
        frequency: reqBody.frequency,
        patientID: ids[0].patientID,
        therapistID: ids[0].therapistID,
        appointmentID: appointmentID,
      })
      .returning()
      .execute();

    console.log(
      `Successfully inserted treatment plan with ID ${treatmentPlanData[0].planID}`
    );

    // Return the newly created treatment plan
    return jsonResponse(
      {
        message: "Treatment plan created successfully",
        data: treatmentPlanData[0],
      },
      201
    );
  } catch (error) {
    console.error(
      `Error while creating treatment plan for appointmentID: ${appointmentID}`,
      error
    );
    return jsonResponse(
      {
        error: "An unexpected error occurred while creating the treatment plan",
      },
      500
    );
  }
}

export async function createExercise(
  reqBody: Exercise,
  profile: {
    id: number;
    therapistID: number;
  }
) {
  const { id, therapistID } = profile;
  if (!id && !therapistID) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      401
    );
  }

  try {
    const newExercise = await db
      .insert(exercises)
      .values({
        planID: reqBody.planID,
        name: reqBody.name,
        description: reqBody.description,
        duration: reqBody.duration,
        videoURL: reqBody.videoURL,
      })
      .returning()
      .execute();

    console.log(
      `Successfully added exercise with ID ${newExercise[0].exerciseID}`
    );
    return jsonResponse(
      { message: "Exercise added successfully", data: newExercise[0] },
      201
    );
  } catch (error) {
    console.error(`Error while creating exercise`, error);
    return jsonResponse(
      {
        error: "An unexpected error occurred while creating the exercise",
      },
      500
    );
  }
}

export async function getExercise(
  planID: number,
  profile: {
    id: number;
  }
) {
  const { id } = profile;
  if (!id) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      401
    );
  }
  try {
    const exerciseData = await db
      .select()
      .from(exercises)
      .where(eq(exercises.planID, planID))
      .execute();

    if (!exerciseData.length) {
      return jsonResponse(
        { error: "No exercise found or access denied." },
        404
      );
    }
    console.log("exercise from database", exerciseData);
    return jsonResponse(exerciseData, 200);
  } catch (error: any) {
    console.error(
      `Error fetching exercise for planID: ${planID}`,
      error.message
    );
    return jsonResponse(
      { error: "An unexpected error occurred while fetching the exercise." },
      500
    );
  }
}
