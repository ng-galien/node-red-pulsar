// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configureTypedFields(isConfig: boolean, fields: TypedField[]): void {
    fields.forEach(function (field) {
        const id = (isConfig ? "node-config-input-" : "node-input-") + field.name
        const input = $("#" + id);
        input.typedInput({
            default: field.type,
            types: [field.type],
            typeField: '#' + id + '-type'
        });
        input.typedInput('width', '100px');
        if (field.value !== undefined) {
            input.typedInput('value', field.value)
        }
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configureEnumField<T extends string>(isConfig: boolean, name: string, options: T[]): void {
    configureOptionalEnumField(isConfig, true, name, options)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configureMandatoryEnumField<T extends string>(isConfig: boolean, name: string, options: T[]): void {
    configureOptionalEnumField(isConfig, true, name, options)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configureOptionalEnumField<T extends string>(isConfig: boolean, optional: boolean, name: string, options: T[]): void {
    const id = (isConfig ? "node-config-input-" : "node-input-") + name
    let optionsCopy = options.map(v => {
        return {value: v, label: v}
    })
    if(optional) {
        //Insert blank option
        optionsCopy.unshift({value: 'Default' as T, label: '' as T})
    }
    $("#" + id).typedInput({
        default: optionsCopy[0].value,
        types: [{
            value: optionsCopy[0].value,
            options: optionsCopy
        }]
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PULSAR_COLOR = '#188fff'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PULSAR_CATEGORY = "pulsar"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CLIENT_ID = "pulsar-client"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AUTHENTICATION_ID = "pulsar-authentication"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SCHEMA_ID = "pulsar-schema"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CONSUMER_ID = "pulsar-consumer"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PRODUCER_ID = "pulsar-producer"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const READER_ID = "pulsar-reader"

