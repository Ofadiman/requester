class TypeGuards {
  public isNull<Type>(value: Type | null): value is null {
    return value === null
  }

  public isNotNull<Type>(value: Type | null): value is Type {
    return value !== null
  }

  public isUndefined<Type>(value: Type | undefined): value is undefined {
    return value === undefined
  }

  public isNotUndefined<Type>(value: Type | undefined): value is Type {
    return value !== undefined
  }

  public isNullOrUndefined<Type>(value: Type | undefined | null): value is undefined | null {
    return value === null || value === undefined
  }

  public isNotNullNorUndefined<Type>(value: Type | undefined | null): value is Type {
    return !(value === undefined || value === null)
  }
}

export const typeGuards = new TypeGuards()
