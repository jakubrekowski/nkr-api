const { ApolloServer, gql } = require('apollo-server');
const { readFileSync } = require('fs');
const { Firestore } = require('@google-cloud/firestore');
const fireorm = require('fireorm');
const { Collection } = require('fireorm')

const firebaseConfig = {
  projectId: 'naturalnakolejrzeczy',
  keyFilename: './serviceAccount.json',
}

const firestore = new Firestore(firebaseConfig);
fireorm.initialize(firestore)

@Collection()
class Manufacturer {
  id: string;
  name: string;
  shortName: string;
  country: string;
  creationDate: string;
  works: Boolean;
  dateOfLiquidation: string;
  units: string;
}



const resolvers = {
  Query: {
    owners: async () => {
      const snapshot = await firestore.collection('owners').get();
      const response = [];
      await snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        response.push(data);
      })

      return response;
    },
    units: async () => {
      const snapshot = await firestore.collection('units').get();
      const response = [];
      await snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        response.push(data);
      })

      return response;
    },
    manufacturers: async () => {
      const snapshot = await firestore.collection('manufacturers').get();
      const response = [];
      await snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        response.push(data);
      })

      return response;
    },
    models: async () => {
      const snapshot = await firestore.collection('models').get();
      const response = [];
      await snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        response.push(data);
      })

      return response;
    },
    imageTags: async () => await prisma.imageTags(),
    documentations: async () => await prisma.dicumentations(),
    // images: async () => await prisma.images(),
    owner: async (parent, args, context, info) => {
      return prisma.owner({ id: args.id });
    },
    unit: async (parent, args, context, info) => {
      return prisma.unit({ id: args.id });
    },
    manufacturer: async (parent, args, context, info) => {
      return prisma.manufacturer({ id: args.id });
    },
    model: async (parent, args, context, info) => {
      return prisma.model({ id: args.id });
    },
    imageTag: async (parent, args, context, info) => {
      return prisma.imageTag({ id: args.id });
    },
    documentation: async (parent, args, context, info) => {
      return prisma.documentation({ id: args.id });
    },
  },
  Mutation: {
    createOwner: async(parent, args) => {
      const owner = { name: args.name };
      return prisma.createOwner(owner);
    },
    createUnit: async(parent, args) => {
      const unit = { 
        name: args.name,
        number: args.number,
        model: { connect: { id: args.model } },
        owner: { connect: { id: args.owner } },
        manufacturer: { connect: { id: args.manufacturer } },
        state: args.state,
        assignments: args.assignments,
        repairHistory: args.repairHistory,
        countryOfOperation: args.countryOfOperation
      };
      return prisma.createUnit(unit);
    },
    createManufacturer: async(parent, args) => {
      const manufacturer = { 
        name: args.name,
        shortName: args.shortName,
        country: args.country,
        creationDate: args.creationDate,
        works: args.works,
        dateOfLiquidation: args.dateOfLiquidation
      };
      return prisma.createManufacturer(manufacturer);
    },
    createModel: async(parent, args) => {
      const model = {
        factoryType: args.factoryType,
        manufacturer: { connect: { id: args.manufacturer } },
        manufacturerModel: args.manufacturerModel,
        modelName: args.modelName,
        intendentUse: args.intendentUse,
        type: args.type,
        specTable: args.specTable,
        series: args.series,
      };
      return prisma.createModel(model);
    },
    createImageTag: async(parent, args) => {
      const imageTag = {
        name: args.name,
      };
      return prisma.createImageTag(imageTag);
    },
    createDocumentation: async(parent, args) => {
      console.log(args)
      const documentation = {
        title: args.title,
        author: args.author,
        issueNumber: args.issueNumber,
        publisher: args.publisher,
        releaseDate: args.releaseDate,
        type: args.type,
        url: args.url,
        model: args.model,
      };
      return prisma.createDocumentation(documentation);
    },
  },
  Owner: {
    units: async (parent, args, context, info) => {
      const doc = await firestore.collection('owners').doc(parent.id).get();
      const owner = await doc.data();

      const units = [];

      console.log(typeof owner.units)

      await Promise.all(owner.units.forEach(async (id) => {
        await firestore.collection('unit').doc(id).get().then(async (doc) => {
          const res = await doc.data();
          res.id = id;
          units.push(res);
        })
      }))

      return units;
    },
  },
  Unit: {
    model: (parent, args, context, info) => {
      return prisma.unit({ id: parent.id }).model()
    },
    owner: (parent, args, context, info) => {
      return prisma.unit({ id: parent.id }).owner()
    },
    manufacturer: (parent, args, context, info) => {
      return prisma.unit({ id: parent.id }).manufacturer()
    },
  },
  Manufacturer: {
    units: async (parent, args, context, info) => {
      return prisma.manufacturer({ id: parent.id }).units()
    }
  },
  Model: {
    manufacturer: (parent, args, context, info) => {
      return prisma.model({ id: parent.id }).manufacturer()
    },
    units: async (parent, args, context, info) => {
      return prisma.model({ id: parent.id }).units()
    },
    documentation: async (parent, args, context, info) => {
      return prisma.model({ id: parent.id }).documentation()
    },
  },
  // ImageTag: {
  //   images: (parent, args, context, info) => {
  //     return prisma.ImageTag({ id: parent.id }).images()
  //   }
  // },
  Documentation: {
    model: async (parent, args, context, info) => {
      return prisma.documentation({ id: parent.id }).model()
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