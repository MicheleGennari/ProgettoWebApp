import mongoose, { Schema, Types } from "mongoose";
import {
  calendarModelName,
  groupModelName,
  resourceModelName,
  userModelName,
} from "./mongo_contract";
import { schemaComposer } from "graphql-compose";
import { composeWithMongoose } from "graphql-compose-mongoose";
import { finalComposer, getMongooseResolvers } from "./graphqlComposeUtilities";

interface IGroup {
  calendar: Types.ObjectId;
  name: string;
  photo: Buffer;
  members: [Types.ObjectId];
  resources: [Types.ObjectId];
  is_project: boolean;
}

const groupSchema = new Schema<IGroup>({
  calendar: { type: Schema.Types.ObjectId, ref: calendarModelName },
  name: String,
  photo: Buffer,
  members: [{ type: Schema.Types.ObjectId, ref: userModelName }],
  resources: [{ type: Schema.Types.ObjectId, ref: resourceModelName }],
  is_project: {
    type: Boolean,
    default: false,
  },
});

const customizationOptions = {};

const groupTC = finalComposer<IGroup>(groupModelName, groupSchema);

schemaComposer.Query.addFields({
  ...getMongooseResolvers(groupTC, "group_").queries,
});

schemaComposer.Mutation.addFields({
  ...getMongooseResolvers(groupTC, "group_").mutations,
});
export const graphqlschema = schemaComposer.buildSchema();
