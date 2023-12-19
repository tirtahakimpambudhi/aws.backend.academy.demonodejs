import Joi from 'joi';

const standardResponse = Joi.object({
  statusCode: Joi.number().required(),
  status: Joi.string().required(),
  message: Joi.string().required(),
  data: Joi.any().optional()
});

const responseValidate = {
  schema: standardResponse,
  failAction: 'error'
};

const notePayloadValidate = Joi.object({
  title: Joi.string().required(),
  tags: Joi.array().items(Joi.string().required()),
  body: Joi.string().required()
});

const noteIdParamsValidate = Joi.object({
  noteId: Joi.string().uuid({ version: 'uuidv4', separator: '-' }).required()
});

export { notePayloadValidate, noteIdParamsValidate, responseValidate };
