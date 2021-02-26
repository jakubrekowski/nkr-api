import { addResolveFunctionsToSchema, ApolloServer, gql } from 'apollo-server';
import { readFileSync, writeFile } from 'fs';
import { Firestore } from '@google-cloud/firestore';
import { initialize, Collection, getRepository } from 'fireorm';

const firebaseConfig = {
  projectId: 'naturalnakolejrzeczy',
  keyFilename: './serviceAccount.json',
}

const firestore = new Firestore(firebaseConfig);
initialize(firestore);

@Collection()
class Manufacturer {
  id: string;
  name: string;
  shortName: string;
  country: string;
  creationDate: string;
  works: Boolean;
  dateOfLiquidation: string;
}

const manufacturerRepository = getRepository(Manufacturer);

@Collection()
class Model {
  id: string;
  factoryType: string;
  manufacturer: string;
  // units: [string]; // without it
  manufacturerModel: string;
  intendentUse: string;
  type: string;
  specTable: string;
  series: string;
  // documentation: [string];
}

const modelRepository = getRepository(Model);

@Collection()
class Owner {
  id: string;
  name: string;
  // units: [string]; // without it
}

const ownerRepository = getRepository(Owner);

@Collection()
class Unit {
  id: string;
  name: string;
  number: string;
  model: string;
  owner: string;
  manufacturer: string;
  state: string;
  assignments: string;
  repairHistory: string;
  countryOfOperation: string;
  heroImage: string;
}

const unitRepository = getRepository(Unit);

@Collection() 
class ImageTag {
  id: string;
  name: string;
}

const imageTagRepository = getRepository(ImageTag);

@Collection()
class ImageObj {
  id: string;
  units: [string];
  models: [string];
  description: string;
  author: string;
  date: string;
  tags: [string];
}

const imageObjRepository = getRepository(ImageObj);

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
  model: string;
}

const documentationRepository = getRepository(Documentation);

const resolvers = {
  Query: {
    owners: async () => {
      const snapshot = await firestore.collection('Owners').get();
      const response = [];
      await snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        response.push(data);
      })

      return response;
    },
    units: async () => {
      const snapshot = await firestore.collection('Units').get();
      const response = [];
      await snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        response.push(data);
      })

      return response;
    },
    manufacturers: async () => {
      const snapshot = await firestore.collection('Manufacturers').get();
      const response = [];
      await snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        response.push(data);
      })

      return response;
    },
    models: async () => {
      const snapshot = await firestore.collection('Models').get();
      const response = [];
      await snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        response.push(data);
      })

      return response;
    },
    imageTags: async () => {
      const snapshot = await firestore.collection('ImageTags').get();
      const response = [];
      await snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        response.push(data);
      })

      return response;
    },
    images: async () => {
      const snapshot = await firestore.collection('ImageObjs').get();
      const response = [];
      await snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        response.push(data);
      })

      return response;
    },
    documentations: async () => {
      const snapshot = await firestore.collection('Documentations').get();
      const response = [];
      await snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        response.push(data);
      })

      return response;
    },
    owner: async (parent, args, context, info) => {
      return await ownerRepository.findById(args.id)
    },
    unit: async (parent, args, context, info) => {
      return await unitRepository.findById(args.id)
    },
    manufacturer: async (parent, args, context, info) => {
      return await manufacturerRepository.findById(args.id)
    },
    model: async (parent, args, context, info) => {
      return await modelRepository.findById(args.id)
    },
    imageTag: async (parent, args, context, info) => {
      return await imageTagRepository.findById(args.id)
    },
    image: async (parent, args, context, info) => {
      return await imageObjRepository.findById(args.id)
    },
    documentation: async (parent, args, context, info) => {
      return await documentationRepository.findById(args.id)
    },
  },
  Mutation: {
    createOwner: async(parent, args) => {
      const owner = new Owner();
      owner.name = args.name;

      const ownerDoc = await ownerRepository.create(owner);
      return await ownerRepository.findById(ownerDoc.id);
    },
    createUnit: async(parent, args) => {
      const unit = new Unit();
      unit.name = args.name;
      unit.number = args.number;
      unit.model = args.model;
      unit.owner = args.owner;
      unit.manufacturer = args.manufacturer;
      unit.state = args.state;
      unit.assignments = args.assignments;
      unit.repairHistory = args.repairHistory;
      unit.countryOfOperation = args.countryOfOperation;
      unit.heroImage = args.heroImage;

      const unitDoc = await unitRepository.create(unit);
      return await unitRepository.findById(unitDoc.id);
    },
    createManufacturer: async(parent, args) => {
      const manufacturer = new Manufacturer();
      manufacturer.name = args.name;
      manufacturer.shortName = args.shortName;
      manufacturer.country = args.country;
      manufacturer.creationDate = args.creationDate;
      manufacturer.works = args.works;
      manufacturer.dateOfLiquidation = args.dateOfLiquidation;

      const manufacturerDoc = await manufacturerRepository.create(manufacturer);
      return await manufacturerRepository.findById(manufacturerDoc.id);
    },
    createModel: async(parent, args) => {
      const model = new Model();
      model.factoryType = args.factoryType;
      model.manufacturer = args.manufacturer;
      model.manufacturerModel = args.manufacturerModel;
      model.intendentUse = args.intendentUse;
      model.type = args.type;
      model.specTable = args.specTable;
      model.series = args.series;

      const modelDoc = await modelRepository.create(model);
      return await modelRepository.findById(modelDoc.id);
    },
    createImageTag: async(parent, args) => {
      const imageTag = new ImageTag();
      imageTag.name = args.name;

      const imageTagDoc = await imageTagRepository.create(imageTag);
      return await imageTagRepository.findById(imageTagDoc.id);
    },
    createImage: async(parent, args) => {
      const image = new ImageObj();
      image.units = args.units;
      image.models = args.models;
      image.description = args.description;
      image.author = args.author;
      image.date = args.date;
      image.tags = args.tags;

      if (args.image === undefined) {
        throw('File not attached!')
      } else {
        const imageDoc = await imageObjRepository.create(image);

        // save image

        // const rowImage = args.image.replace(/^data:([A-Za-z-+\/]+);base64,(.+)$/, '');

        // console.log(rowImage)

        // writeFile(`./temp/${imageDoc.id}.png`, rowImage, 'base64', (err) => {
        //   imageObjRepository.delete(imageDoc.id);
        //   console.error(err);
        // })
  
        return await imageObjRepository.findById(imageDoc.id);
      }     
    },
    createDocumentation: async(parent, args) => {
      const documentation = new Documentation();
      documentation.title = args.title;
      documentation.author = args.author;
      documentation.issueNumber = args.issueNumber;
      documentation.publisher = args.publisher;
      documentation.releaseDate = args.releaseDate;
      documentation.type = args.type;
      documentation.url = args.url;
      documentation.model = args.model;
      
      const documentationDoc = await documentationRepository.create(documentation);
      return await documentationRepository.findById(documentationDoc.id);
    },
  },
  Owner: {
    units: async (parent, args, context, info) => {
      return await unitRepository.whereEqualTo('owner', parent.id).find();
    },
  },
  Unit: {
    model: async (parent, args, context, info) => {
      return await modelRepository.findById(parent.model);
    },
    owner: async (parent, args, context, info) => {
      return await ownerRepository.findById(parent.owner);
    },
    manufacturer: async (parent, args, context, info) => {
      return await manufacturerRepository.findById(parent.manufacturer);
    },
    images: async (parent, args, context, info) => {
      return await imageObjRepository.whereArrayContains('units', parent.id)
    }
  },
  Manufacturer: {
    units: async (parent, args, context, info) => {
      return await unitRepository.whereEqualTo('manufacturer', parent.id).find();
    }
  },
  Model: {
    manufacturer: async (parent, args, context, info) => {
      return await manufacturerRepository.findById(parent.manufacturer);
    },
    units: async (parent, args, context, info) => {
      return await unitRepository.whereEqualTo('model', parent.id).find();
    },
    documentation: async (parent, args, context, info) => {
      return await documentationRepository.whereEqualTo('model', parent.id).find();
    },
    images: async (parent, args, context, info) => {
      return await imageObjRepository.whereArrayContains('models', parent.id)
    }
  },
  ImageTag: {
    images: async (parent, args, context, info) => {
      return await imageObjRepository.whereArrayContains('tags', parent.id)
    }
  },
  Image: {
    units: async (parent, args, context, info) => {
      const unitsIds = parent.units;
      let units = []
      for (const id of unitsIds) {
        units.push(await unitRepository.findById(id))
      }
      return units
    },
    models: async (parent, args, context, info) => {
      const modelsIds = parent.models;
      let models = []
      for (const id of modelsIds) {
        models.push(await modelRepository.findById(id))
      }
      return models
    },
    tags: async (parent, args, context, info) => {
      const tagsIds = parent.tags;
      let tags = []
      for (const id of tagsIds) {
        const tempDoc = await imageTagRepository.findById(id)
        if (tempDoc !== null) {
          tags.push(tempDoc)
        }
      }
      return tags
    }
  },
  Documentation: {
    model: async (parent, args, context, info) => {
      return await modelRepository.findById(parent.id);
    },
  },
}

const server = new ApolloServer({ 
  typeDefs: gql`${readFileSync(__dirname.concat('/schema.gql'), 'utf8')}`,
  resolvers 
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});