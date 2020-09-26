# Kronos

A tool to document a projects visual process with the ability to review its iterations.

# Elements // Elemente

## User // Benutzer

A kronos User.
Has Customers, workes on Projects and fills them with Files.

```TypeScript
{
    // atributes
    name: string
    UId: string
    customers: customer[]
    
    // methods
    create: () => void
    remove: () => void
}
```

## Customer // Kunde

A Customer served by a Kronos user.
Has Projects, has Projects that are being filled with Files by Users.

```TypeScript
{
    // atributes
    name: string
    UId: string
    projects: project[]
    
    // methods
    create: () => void
    remove: () => void
}
```

## Projekt // Board // Table

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

# Development

Install and run:

```bash
npm install
npm run dev
```
