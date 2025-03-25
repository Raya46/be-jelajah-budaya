const userEventRatingSchema = {
    UserEventRating: {
      type: "object",
      required: ["userId", "eventId"],
      properties: {
        id: {
          type: "integer",
          description: "ID rating",
        },
        userId: {
          type: "integer",
          description: "ID pengguna",
        },
        eventId: {
          type: "integer",
          description: "ID event",
        },
        rating: {
          type: "integer",
          description: "Rating event (opsional)",
        },
        review: {
          type: "string",
          description: "Review event (opsional)",
        },
        createdAt: {
          type: "string",
          format: "date-time",
          description: "Waktu pembuatan",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          description: "Waktu update terakhir",
        },
      },
    },
    Error: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Pesan error",
        },
        error: {
          type: "string",
          description: "Detail error",
        },
      },
    },
  };
  
  export default userEventRatingSchema;