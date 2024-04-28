// eslint-disable-next-line @typescript-eslint/no-unused-vars
type EditorWidgetTypedInputType = import("node-red").EditorWidgetTypedInputType

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configureTypedFields(isConfig: boolean, fields: TypedField[]) {
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
function configureEnumField<T extends string>(isConfig: boolean, name: string, options: T[]) {
    const id = (isConfig ? "node-config-input-" : "node-input-") + name
    $("#" + id).typedInput({
        default: options[0],
        types: [{
            value: options[0],
            options: options.map(value => ({value, label: value}))
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

