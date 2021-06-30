module.exports = {
  messages: {
    common: {
      InternalServiceError: "Internal Service Error occurred",
    },
    login: {
      InvalidCredentials: "Invalid email or password",
      LoginSuccessful: "LoggedIn Successfully",
    },
    logout: {
      LogoutSuccessful: "Logged out Successfully",
    },
    Registration: {
      UserCreationSuccess: "User created successfully",
    },
    Consignments: {
      ConsignmentCreationSuccess: "Consignment created successfully",
      ConsignmentsDoesntExist: "No consignments available for the user",
      ConsignmentDoesntExist: "No consignment matches with the given ID",
      ConsignmentUpdateSuccess: "Consignment updated successfully",
      ConsignmentUpdateFail: "No Consignment with the given ID exists",
      ConsignmentDeleteSuccess: "Consignment deletes successfully",
      ConsignmentDeleteFail: "No Consignment with the given ID exists",
    },
    Users: {
      UserNotFound: "No user with the given ID exists",
      UpdatedSuccess: "User updated successfully",
      UserUpdateFail: "No user with the given ID exists",
      UserDeletedFail: "No user with the given ID exists",
      UserDeletedSuccess: "User deleted successfully",
    },
    Carriers: {
      CarrierCreationSuccess: "Journey created successfully",
      JourneysDoesntExist: "No journeys available for the user",
      JourneyDoesntExist: "No journey matches with the given ID",
      JourneyUpdateSuccess: "Journey updated successfully",
      JourneyUpdateFail: "No Journey with the given ID exists",
    },
  },
  statuses: {
    Failure: "FAILURE",
    Success: "SUCCESS",
  },
};
