const userEventRatingPath = {
    "/event-ratings": {
      get: {
        summary: "Mendapatkan semua rating event",
        tags: ["UserEventRating"],
        responses: {
          200: {
            description: "Daftar semua rating event",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "success",
                    },
                    ratings: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/UserEventRating",
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          403: {
            $ref: "#/components/responses/ForbiddenError",
          },
        },
      },
    },
    "/event-ratings/{id}": {
      get: {
        summary: "Mendapatkan rating event berdasarkan ID",
        tags: ["UserEventRating"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID rating",
          },
        ],
        responses: {
          200: {
            description: "Data rating event",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "success",
                    },
                    rating: {
                      $ref: "#/components/schemas/UserEventRating",
                    },
                  },
                },
              },
            },
          },
          404: {
            $ref: "#/components/responses/NotFoundError",
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          403: {
            $ref: "#/components/responses/ForbiddenError",
          },
        },
      },
    },
    "/event-ratings/event/{eventId}": {
      get: {
        summary: "Mendapatkan rating event berdasarkan ID event",
        tags: ["UserEventRating"],
        parameters: [
          {
            in: "path",
            name: "eventId",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID event",
          },
        ],
        responses: {
          200: {
            description: "Data rating event",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "success",
                    },
                    ratings: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/UserEventRating",
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            $ref: "#/components/responses/NotFoundError",
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          403: {
            $ref: "#/components/responses/ForbiddenError",
          },
        },
      },
    },
    "/event-ratings/event/{eventId}/average": {
      get: {
        summary: "Mendapatkan rata-rata rating event berdasarkan ID event",
        tags: ["UserEventRating"],
        parameters: [
          {
            in: "path",
            name: "eventId",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID event",
          },
        ],
        responses: {
          200: {
            description: "Rata-rata rating event",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "success",
                    },
                    averageRating: {
                      type: "number",
                      example: 4.5,
                    },
                  },
                },
              },
            },
          },
          404: {
            $ref: "#/components/responses/NotFoundError",
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          403: {
            $ref: "#/components/responses/ForbiddenError",
          },
        },
      },
    },
    "/event-ratings/user/{userId}": {
      get: {
        summary: "Mendapatkan rating event berdasarkan ID pengguna",
        tags: ["UserEventRating"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "userId",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID pengguna",
          },
        ],
        responses: {
          200: {
            description: "Data rating event",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "success",
                    },
                    ratings: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/UserEventRating",
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            $ref: "#/components/responses/NotFoundError",
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          403: {
            $ref: "#/components/responses/ForbiddenError",
          },
        },
      },
    },
    "/event-ratings/join": {
      post: {
        summary: "Mengikuti event",
        tags: ["UserEventRating"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: {
                    type: "integer",
                    example: 1,
                  },
                  eventId: {
                    type: "integer",
                    example: 1,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Berhasil mengikuti event",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Berhasil mengikuti event",
                    },
                    rating: {
                      $ref: "#/components/schemas/UserEventRating",
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          403: {
            $ref: "#/components/responses/ForbiddenError",
          },
          500: {
            $ref: "#/components/responses/ServerError",
          },
        },
      },
    },
    "/event-ratings/{id}/rate": {
      put: {
        summary: "Memberikan rating pada event",
        tags: ["UserEventRating"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID rating",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  rating: {
                    type: "integer",
                    example: 5,
                  },
                  review: {
                    type: "string",
                    example: "Event yang sangat bagus!",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Rating berhasil diberikan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Rating berhasil diberikan",
                    },
                    rating: {
                      $ref: "#/components/schemas/UserEventRating",
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          403: {
            $ref: "#/components/responses/ForbiddenError",
          },
          500: {
            $ref: "#/components/responses/ServerError",
          },
        },
      },
    },
    "/get-event-ratings/:id": {
      delete: {
        summary: "Membatalkan partisipasi event",
        tags: ["UserEventRating"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID rating",
          },
        ],
        responses: {
          200: {
            description: "Partisipasi event berhasil dibatalkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Partisipasi event berhasil dibatalkan",
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          403: {
            $ref: "#/components/responses/ForbiddenError",
          },
          500: {
            $ref: "#/components/responses/ServerError",
          },
        },
      },
    },
  };
  
  export default userEventRatingPath;