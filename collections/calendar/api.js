Api = new Mongo.Collection('api');


Api.attachSchema(new SimpleSchema({
  userId: {
    type: String
  },
  token: {
    type: String,
    unique: true,
    optional: true
  },
  start: {
    type: Date,
    optional: true
  },
  expired: {
    type: Date,
    optional: true
  },
  // number of api has been called in 10 mins cycle.
  period: {
    type: Number,
    optional: true
  },
  // total number of api has been called
  total: {
    type: Number,
    optional: true
  }
}));

