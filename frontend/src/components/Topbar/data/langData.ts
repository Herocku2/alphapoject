import usFlag from "/united-states.png"
import esFlag from "/spain.png"

interface langData {
  name: string
  flag: string
  id: string
}

export const langData: langData[] = [
  {
    name: 'English',
    flag: usFlag,
    id: "en"
  },
  {
    name: 'Spanish',
    flag: esFlag,
    id: "es"
  },
]
