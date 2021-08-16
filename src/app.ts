import { ApolloServer, gql } from 'apollo-server';
import { Firestore } from '@google-cloud/firestore';
import { initialize, Collection, getRepository } from 'fireorm';
import { config as dotenvConfig } from 'dotenv';
import { verify as verifyJwt } from 'jsonwebtoken';
import { readFileSync } from 'node:fs';
import * as permissions from './permissions';

dotenvConfig();

const firebaseConfig = {
  projectId: 'naturalnakolejrzeczy',
  keyFilename: './serviceAccount.json',
}

const firesotre = new Firestore(firebaseConfig);
initialize(firesotre);

@Collection()
class Manufacturer {
  id: string;
  name: string; 
  shortName: string; 
  country: string; 
  creationDate: string; 
  works: Boolean;
  dateOfLiquidation: string; 
  heroImage: string; 
  moderator: string;
  updateDate: number;
  verified: string;
}

const manufacturerRepo = getRepository(Manufacturer);

@Collection()
class LocomotiveModel {
  id: string;
  factoryType: Array<string>; 
  manufacturer: Array<string>;
  intendentUse: string;
  tractionType: string;
  specTable: string; 
  series: Array<string>; 
  heroImage: string;
  moderator: string;
  updateDate: number;
  verified: string;
}

const locomotiveModelRepo = getRepository(LocomotiveModel);

@Collection()
class Owner {
  id: string;
  name: string; 
  isAssociation: boolean;
  adress: string;
  geopoint: string;
  website: string;
  heroImage: string; 
  moderator: string;
  updateDate: number;
  verified: string;
}

const ownerRepo = getRepository(Owner);

@Collection()
class Locomotive {
  id: string;
  number: string; 
  model: string; 
  owner: string; 
  manufacturer: string; 
  state: string; 
  assignments: string;
  repairHistory: string;
  countryOfOperation: string;
  heroImage: string;
  tegs: Array<string>;
  moderator: string;
  updateDate: number;
  verified: string;
}

const locomotiveRepo = getRepository(Locomotive);

@Collection()
class Tag {
  id: string;
  name: string;
  moderator: string;
  updateDate: number;
  verified: string;
}

const tagRepo = getRepository(Tag);

@Collection()
class Picture {
  id: string;
  units: [string]; 
  models: [string]; 
  description: string;
  date: string; 
  tags: [string]; 
  moderator: string;
  updateDate: number;
  verified: string;
}

const pictureRepo = getRepository(Picture);

@Collection()
class Documentation {
  id: string;
  title: string;  
  author: string; 
  issueNumber: string; 
  publisher: string; 
  releaseDate: string; 
  type: string; 
  url: string; 
  model: Array<string>; 
  moderator: string;
  updateDate: number;
  verified: string;
}

const documentationRepo = getRepository(Documentation);

const resolvers = {
  Query: {
    manufacturers: async () => {
      const manufacturers = await manufacturerRepo.find();
      return manufacturers;
    },
    locomotiveModels: async () => {
      const locomotiveModels = await locomotiveModelRepo.find();
      return locomotiveModels;
    },
    owners: async () => { 
      const owners = await ownerRepo.find();
      return owners;
    },
    locomotives: async () => {
      const locomotives = await locomotiveRepo.find();
      return locomotives;
    },
    tags: async () => {
      const tags = await tagRepo.find();
      return tags;
    },
    pictures: async () => {
      const pictures = await pictureRepo.find();
      return pictures;
    },
    documentations: async () => {
      const documentation = await documentationRepo.find();
      return documentation;
    },
    associations: async () => {
      const owners = await ownerRepo.whereEqualTo('isAssociation', true );
      return owners;
    },
    manufacturer: async (parent, args) => {
      const manufacturer = await manufacturerRepo.findById(args.id);
      return manufacturer;
    },
    locomotiveModel: async (parent, args) => {
      const locomotiveModel = await locomotiveModelRepo.findById(args.id);
      return locomotiveModel;
    },
    owner: async (parent, args) => {
      const owner = await ownerRepo.findById(args.id);
      return owner;
    },
    locomotive: async (parent, args) => {
      const locomotive = await locomotiveRepo.findById(args.id);
      return locomotive;
    },
    tag: async (parent, args) => {
      const tag = await tagRepo.findById(args.id);
      return tag;
    },
    picture: async (parent, args) => {
      const picture = await pictureRepo.findById(args.id);
      return picture;
    },
    documentation: async (parent, args) => {
      const documentation = await documentationRepo.findById(args.id);
      return documentation;
    },
  },
  Mutation: {
    createManufacturer: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to create a manufacturer');
      }

      const manufacturer = new Manufacturer();
      manufacturer.name = args.name;
      manufacturer.shortName = args.shortName;
      manufacturer.country = args.country;
      manufacturer.creationDate = args.creationDate;
      manufacturer.works = args.works;
      manufacturer.dateOfLiquidation = args.dateOfLiquidation;
      manufacturer.heroImage = args.heroImage;
      manufacturer.moderator = tokenPayload.iss;
      manufacturer.updateDate = Date.now();
      manufacturer.verified = null;

      const verifyPermission = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'VERIFY_CONTENT')
      if (verifyPermission) {
        manufacturer.verified = tokenPayload.iss
      }

      await manufacturerRepo.create(manufacturer);
      return manufacturer;
    },
    updateManufacturer: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to update a manufacturer');
      }

      const manufacturer = await manufacturerRepo.findById(args.id);
      manufacturer.name = args.name;
      manufacturer.shortName = args.shortName;
      manufacturer.country = args.country;
      manufacturer.creationDate = args.creationDate;
      manufacturer.works = args.works;
      manufacturer.dateOfLiquidation = args.dateOfLiquidation;
      manufacturer.heroImage = args.heroImage;
      manufacturer.moderator = tokenPayload.iss;
      manufacturer.updateDate = Date.now();
      await manufacturerRepo.update(manufacturer);
      return manufacturer;
    },
    deleteManufacturer: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'DELETE_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to delete a manufacturer');
      }

      const manufacturer = await manufacturerRepo.findById(args.id);
      await manufacturerRepo.delete(manufacturer.id);
      return manufacturer;
    },
    createLocomotiveModel: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to create a locomotive model');
      }

      const locomotiveModel = new LocomotiveModel();
      locomotiveModel.factoryType = args.factoryType
      locomotiveModel.manufacturer = args.manufacturer;
      locomotiveModel.intendentUse = args.intendentUse;
      locomotiveModel.tractionType = args.tractionType;
      locomotiveModel.specTable = args.specTable;
      locomotiveModel.series = args.series;
      locomotiveModel.heroImage = args.heroImage;
      locomotiveModel.moderator = tokenPayload.iss;
      locomotiveModel.updateDate = Date.now();
      locomotiveModel.verified = null;

      const verifyPermission = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'VERIFY_CONTENT')
      if (verifyPermission) {
        locomotiveModel.verified = tokenPayload.iss
      }

      await locomotiveModelRepo.create(locomotiveModel);
      return locomotiveModel;
    },
    updateLocomotiveModel: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to update a locomotive model');
      }

      const locomotiveModel = await locomotiveModelRepo.findById(args.id);
      locomotiveModel.factoryType = args.factoryType
      locomotiveModel.manufacturer = args.manufacturer;
      locomotiveModel.intendentUse = args.intendentUse;
      locomotiveModel.tractionType = args.tractionType;
      locomotiveModel.specTable = args.specTable;
      locomotiveModel.series = args.series;
      locomotiveModel.heroImage = args.heroImage;
      locomotiveModel.moderator = tokenPayload.iss;
      locomotiveModel.updateDate = Date.now();
      await locomotiveModelRepo.update(locomotiveModel);
      return locomotiveModel;
    },
    deleteLocomotiveModel: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'DELETE_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to delete a locomotive model');
      }

      const locomotiveModel = await locomotiveModelRepo.findById(args.id);
      await locomotiveModelRepo.delete(locomotiveModel.id);
      return locomotiveModel;
    },
    createOwner: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to create an owner');
      }

      const owner = new Owner();
      owner.name = args.name;
      owner.isAssociation = args.isAssociation;
      owner.adress = args.adress;
      owner.geopoint = args.geopoint;
      owner.website = args.website;
      owner.heroImage = args.heroImage;
      owner.moderator = tokenPayload.iss;
      owner.updateDate = Date.now();
      owner.verified = null;

      const verifyPermission = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'VERIFY_CONTENT')
      if (verifyPermission) {
        owner.verified = tokenPayload.iss
      }

      await ownerRepo.create(owner);
      return owner;
    },
    updateOwner: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to update an owner');
      }

      const owner = await ownerRepo.findById(args.id);
      owner.name = args.name;
      owner.isAssociation = args.isAssociation;
      owner.adress = args.adress;
      owner.geopoint = args.geopoint;
      owner.website = args.website;
      owner.heroImage = args.heroImage;
      owner.moderator = tokenPayload.iss;
      owner.updateDate = Date.now();
      await ownerRepo.update(owner);
      return owner;
    },
    deleteOwner: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'DELETE_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to delete an owner');
      }

      const owner = await ownerRepo.findById(args.id);
      await ownerRepo.delete(owner.id);
      return owner;
    },
    createLocomotive: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to create a locomotive');
      }

      const locomotive = new Locomotive();
      locomotive.number = args.number;
      locomotive.model = args.model;
      locomotive.owner = args.owner;
      locomotive.manufacturer = args.manufacturer;
      locomotive.state = args.state;
      locomotive.assignments = args.assignments;
      locomotive.repairHistory = args.repairHistory;
      locomotive.countryOfOperation = args.countryOfOperation;
      locomotive.heroImage = args.heroImage;
      locomotive.moderator = tokenPayload.iss;
      locomotive.updateDate = Date.now();
      locomotive.verified = null;

      const verifyPermission = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'VERIFY_CONTENT')
      if (verifyPermission) {
        locomotive.verified = tokenPayload.iss
      }

      await locomotiveRepo.create(locomotive);
      return locomotive;
    },
    updateLocomotive: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to update a locomotive');
      }

      const locomotive = await locomotiveRepo.findById(args.id);
      locomotive.number = args.number;
      locomotive.model = args.model;
      locomotive.owner = args.owner;
      locomotive.manufacturer = args.manufacturer;
      locomotive.state = args.state;
      locomotive.assignments = args.assignments;
      locomotive.repairHistory = args.repairHistory;
      locomotive.countryOfOperation = args.countryOfOperation;
      locomotive.heroImage = args.heroImage;
      locomotive.moderator = tokenPayload.iss;
      locomotive.updateDate = Date.now();
      locomotive.verified = null;

      const verifyPermission = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'VERIFY_CONTENT')
      if (verifyPermission) {
        locomotive.verified = tokenPayload.iss
      }

      await locomotiveRepo.update(locomotive);
      return locomotive;
    },
    deleteLocomotive: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'DELETE_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to delete a locomotive');
      }

      const locomotive = await locomotiveRepo.findById(args.id);
      await locomotiveRepo.delete(locomotive.id);
      return locomotive;
    },
    createTag: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to create a tag');
      }

      const tag = new Tag();
      tag.id = args.id;
      tag.name = args.name;
      tag.moderator = tokenPayload.iss;
      tag.updateDate = Date.now();

      const verifyPermission = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'VERIFY_CONTENT')
      if (verifyPermission) {
        tag.verified = tokenPayload.iss
      }

      await tagRepo.create(tag);
      return tag;
    },
    updateTag: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);
      
      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to update a tag');
      }

      const tag = await tagRepo.findById(args.id);
      tag.name = args.name;
      tag.moderator = tokenPayload.iss;
      tag.updateDate = Date.now();
      await tagRepo.update(tag);
      return tag;
    },
    deleteTag: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'DELETE_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to delete a tag');
      }

      const tag = await tagRepo.findById(args.id);
      await tagRepo.delete(tag.id);
      return tag;
    },
    createPicture: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to create a picture');
      }

      const picture = new Picture();
      picture.units = args.units;
      picture.models = args.models;
      picture.description = args.description;
      picture.date = args.date;
      picture.tags = args.tags;
      picture.moderator = tokenPayload.iss;
      picture.updateDate = Date.now();
      picture.verified = null;

      const verifyPermission = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'VERIFY_CONTENT')
      if (verifyPermission) {
        picture.verified = tokenPayload.iss
      }

      await pictureRepo.create(picture);
      return picture;
    },
    updatePicture: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to update a picture');
      }

      const picture = await pictureRepo.findById(args.id);
      picture.units = args.units;
      picture.models = args.models;
      picture.description = args.description;
      picture.date = args.date;
      picture.tags = args.tags;
      picture.moderator = tokenPayload.iss;
      picture.updateDate = Date.now();
      await pictureRepo.update(picture);
      return picture;
    },
    deletePicture: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'DELETE_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to delete a picture');
      }

      const picture = await pictureRepo.findById(args.id);
      await pictureRepo.delete(picture.id);
      return picture;
    },
    createDocumentation: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to create a documentation');
      }

      const documentation = new Documentation();
      documentation.title = args.title;
      documentation.author = args.author;
      documentation.issueNumber = args.issueNumber;
      documentation.publisher = args.publisher;
      documentation.releaseDate = args.releaseDate;
      documentation.type = args.type;
      documentation.url = args.url;
      documentation.model = args.model;
      documentation.moderator = tokenPayload.iss;
      documentation.updateDate = Date.now();
      documentation.verified = null;

      const verifyPermission = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'VERIFY_CONTENT')
      if (verifyPermission) {
        documentation.verified = tokenPayload.iss
      }

      await documentationRepo.create(documentation);
      return documentation;
    },
    updateDocumentation: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'ADD_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to update a documentation');
      }

      const documentation = await documentationRepo.findById(args.id);
      documentation.title = args.title;
      documentation.author = args.author;
      documentation.issueNumber = args.issueNumber;
      documentation.publisher = args.publisher;
      documentation.releaseDate = args.releaseDate;
      documentation.type = args.type;
      documentation.url = args.url;
      documentation.model = args.model;
      documentation.moderator = tokenPayload.iss;
      documentation.updateDate = Date.now();
      await documentationRepo.update(documentation);
      return documentation;
    },
    deleteDocumentation: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const tokenPermissions = permissions.readInt(tokenPayload.permissions)
        .find(permission => permission === 'DELETE_CONTENT');
      if (!tokenPermissions) {
        throw new Error('You are not allowed to delete a documentation');
      }

      const documentation = await documentationRepo.findById(args.id);
      await documentationRepo.delete(documentation.id);
      return documentation;
    }
  }}

const server = new ApolloServer({
  typeDefs: gql`${readFileSync(__dirname.concat('/schema.gql'), 'utf8')}`,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
