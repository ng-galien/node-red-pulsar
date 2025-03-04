/**
 * Configure the typed input fields.
 * @param isConfig
 * @param fields
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configureTypedFields(isConfig: boolean, fields: TypedField[]): void {
  fields.forEach(function (field) {
    const id = (isConfig ? 'node-config-input-' : 'node-input-') + field.name;
    const input = $('#' + id);
    const defaultVal =
      field.defaultType ||
      (Array.isArray(field.type) ? field.type[0] : field.type);

    const types = Array.isArray(field.type) ? field.type : [field.type];
    input.typedInput({
      default: defaultVal,
      types: types,
      typeField: '#' + id + '-type',
    });
    //input.typedInput('width', '100px');
    if (field.value !== undefined) {
      input.typedInput('value', field.value);
    }
  });
}

/**
 * Get the property type.
 * @param isConfig if the node is a config node
 * @param name the property name
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPropertyType(isConfig: boolean, name: string): string {
  const id = (isConfig ? 'node-config-input-' : 'node-input-') + name;
  const input = $('#' + id);
  return input.typedInput('type');
}

/**
 * Configure the enum field.
 * @param isConfig if the node is a config node
 * @param name the property name
 * @param options the enum options
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configureEnumField<T extends string>(
  isConfig: boolean,
  name: string,
  options: T[],
): void {
  configureOptionalEnumField(isConfig, true, name, options);
}

/**
 * Configure the mandatory enum field.
 * @param isConfig if the node is a config node
 * @param name the property name
 * @param options the enum options
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configureMandatoryEnumField<T extends string>(
  isConfig: boolean,
  name: string,
  options: T[],
): void {
  configureOptionalEnumField(isConfig, false, name, options);
}

/**
 * Configure the optional enum field.
 * @param isConfig if the node is a config node
 * @param optional if the field is optional
 * @param name the property name
 * @param options the enum options
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configureOptionalEnumField<T extends string>(
  isConfig: boolean,
  optional: boolean,
  name: string,
  options: T[],
): void {
  const id = (isConfig ? 'node-config-input-' : 'node-input-') + name;
  const optionsCopy = options.map((v) => {
    return { value: v, label: v };
  });
  if (optional) {
    //Insert blank option
    optionsCopy.unshift({ value: 'Default' as T, label: '' as T });
  }
  $('#' + id).typedInput({
    default: optionsCopy[0].value,
    types: [
      {
        value: optionsCopy[0].value,
        options: optionsCopy,
      },
    ],
  });
}

/**
 * Configure the json string field.
 * @param isConfig if the node is a config node
 * @param name the property name
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configureJsonStringField(isConfig: boolean, name: string): void {
  const propertiesInput = $(
    '#' + (isConfig ? 'node-config-input-' : 'node-input-') + name,
  );
  if (propertiesInput.typedInput('value') === '') {
    propertiesInput.typedInput('value', '{}');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PULSAR_COLOR = '#188fff';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PULSAR_CATEGORY = 'pulsar';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PULSAR_CONFIG = 'config';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CLIENT_ID = 'pulsar-client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AUTHENTICATION_ID = 'pulsar-authentication';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SCHEMA_ID = 'pulsar-schema';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CONSUMER_ID = 'pulsar-consumer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PRODUCER_ID = 'pulsar-producer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const READER_ID = 'pulsar-reader';
