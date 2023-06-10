import { faker, fakerRO } from '@faker-js/faker'

export type Person = {
    id:number;
    name:string;
    password:string;
    points:number;
    subRows?:Person[];
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  return {
    id:faker.number.int(),
    name:faker.name.firstName(),
    password:faker.string.sample(),
    points:faker.number.int(),
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!
    return range(len).map((d): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
