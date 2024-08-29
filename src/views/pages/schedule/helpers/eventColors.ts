

interface colorType {
    id: number;
    eColor: string;
    value: string;
}


export const ColorVariation: colorType[] = [
    {
        id: 1,
        eColor: '#C5C5C5',
        value: 'default',
    },
    {
        id: 2,
        eColor: '#98c11d',
        value: 'owner',
    },
    {
        id: 3,
        eColor: '#39A3DC',
        value: 'user',
    },
    {
        id: 4,
        eColor: '#445fbe',
        value: 'coach',
    },
    {
        id: 5,
        eColor: '#fdd43f',
        value: 'warning',
    },
];