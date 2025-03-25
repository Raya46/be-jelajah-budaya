import userSchema from "./schemas/user.schema";
import provinsiSchema from "./schemas/provinsi.schema";
import daerahSchema from "./schemas/daerah.schema";
import budayaSchema from "./schemas/budaya.schema";
import eventSchema from "./schemas/event.schema";
import userEventRatingSchema from "./schemas/userEventRating.schema";

import authPath from "./paths/auth.path";
import userPath from "./paths/user.path";
import provinsiPath from "./paths/provinsi.path";
import daerahPath from "./paths/daerah.path";
import budayaPath from "./paths/budaya.path";
import eventPath from "./paths/event.path";
import userEventRatingPath from "./paths/userEventRating.path";

import responses from "./responses";

const swaggerDefinition = {
  openapi: "3.0.1",
  info: {
    title: "API Budaya Indonesia",
    version: "2.0.0",
    description: "API dokumentasi untuk aplikasi Budaya Indonesia",
    contact: {
      name: "Developer",
      email: "developer@budayaindonesia.com",
    },
  },
  servers: [
    {
      url: "/api",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ...userSchema,
      ...provinsiSchema,
      ...daerahSchema,
      ...budayaSchema,
      ...eventSchema,
      ...userEventRatingSchema,
    },
    responses,
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    ...authPath,
    ...userPath,
    ...provinsiPath,
    ...daerahPath,
    ...budayaPath,
    ...eventPath,
    ...userEventRatingPath,
  },
  tags: [
    { name: "Auth", description: "Autentikasi pengguna" },
    { name: "Users", description: "Manajemen pengguna" },
    { name: "Provinsi", description: "Manajemen provinsi" },
    { name: "Daerah", description: "Manajemen daerah" },
    { name: "Budaya", description: "Manajemen budaya" },
    { name: "Event", description: "Manajemen event" },
    { name: "Rating", description: "Manajemen rating event" },
  ],
};

export default swaggerDefinition;
