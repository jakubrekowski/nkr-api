import { ApolloServer, gql } from 'apollo-server';
import { Firestore } from '@google-cloud/firestore';
import { initialize, Collection, getRepository } from 'fireorm';
import { config as dotenvConfig } from 'dotenv';
import { verify as verifyJwt } from 'jsonwebtoken';
import { readFileSync } from 'node:fs';

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
}

const locomotiveRepo = getRepository(Locomotive);

@Collection()
class Tag {
  id: string;
  name: string;
  moderator: string;
  updateDate: number;
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
    // association: async (parent, args) => {
    //   const owner = await ownerRepo.whereEqualTo('isAssociation', true ).findById(args.id);
    //   return owner;
    // },
  },
  Mutation: {
    createManufacturer: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

      const manufacturer = new Manufacturer();
      manufacturer.id = args.id;
      manufacturer.name = args.name;
      manufacturer.shortName = args.shortName;
      manufacturer.country = args.country;
      manufacturer.creationDate = args.creationDate;
      manufacturer.works = args.works;
      manufacturer.dateOfLiquidation = args.dateOfLiquidation;
      manufacturer.heroImage = args.heroImage;
      manufacturer.moderator = tokenPayload.iss;
      manufacturer.updateDate = Date.now();
      await manufacturerRepo.create(manufacturer);
      return manufacturer;
    },
    updateManufacturer: async (parent, args) => {
      const tokenPayload = verifyJwt(args.token, process.env.tokenSecret);

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
      const manufacturer = await manufacturerRepo.findById(args.id);
      await manufacturerRepo.delete(manufacturer.id);
      return manufacturer;
    },
  }}

const server = new ApolloServer({
  typeDefs: gql`${readFileSync(__dirname.concat('/schema.gql'), 'utf8')}`,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
