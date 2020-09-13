# Kronos

A tool to document a projects visual process with the ability to review its iterations.

# Elements // Elemente

## File // Design // Entwurf

A single design File. 
Can be a piece of work, a reference or an inspiration.

```TypeScript
{
    // atributes
    name: string
    description: string
    src: string
    thumb: string
    
    // methods
    create: () => void
    remove: () => void
}
```

## Board // Table // Projekt

A collection of Files.
Ordered on a Grid for easy presentation and Access.

```TypeScript
{
    // atributes
    name: string
    description: string
    iterations: []

    // methods
    addFile: () => void
    removeFile: () => void
    createSnapshot: () => void
}
```


# Development

Install and run:

```bash
npm install
npm run dev
```
