import { composeWithMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";
import { getMongooseResolvers } from "./graphqlComposeUtilities";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: String,
  id: Number,
});

const eventModel =
  mongoose.models.Event || mongoose.model("Event", eventSchema);

const customizationOptions = {};

const eventTC = composeWithMongoose(eventModel, customizationOptions);

schemaComposer.Query.addFields({
  ...getMongooseResolvers(eventTC, "event_").queries,
});

schemaComposer.Mutation.addFields({
  ...getMongooseResolvers(eventTC, "event_").mutations,
});

fs.writeFileSync("../../../schema.graphql", schemaComposer.toSDL());

export const graphqlschema = schemaComposer.buildSchema({});
