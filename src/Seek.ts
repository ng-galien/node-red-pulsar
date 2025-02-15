import { MessageId } from 'pulsar-client';

/**
 * Represents a seek position in a Pulsar reader.
 */
export type SeekPosition = {
    id: MessageId | undefined;
    timestamp: number;
};

/**
 * Parses the given value and returns a SeekPosition object.
 * @param {any|undefined} value - The value to parse.
 * @return {SeekPosition|undefined} - The parsed SeekPosition object, or undefined if the value is not valid.
 */
export function parseSeekPosition(
    value: any | undefined,
): SeekPosition | undefined {
    if (value === 'Earliest') {
        return { id: MessageId.earliest(), timestamp: 0 };
    }
    if (value === 'Latest') {
        return { id: MessageId.latest(), timestamp: 0 };
    }
    const num = Number(value);
    return isNaN(num)
        ? undefined
        : { id: MessageId.earliest(), timestamp: num };
}
