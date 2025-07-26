const sumar = (a, b) => a + b

describe('Pruebas de la funcion suma', () => {
  it('comprobando el resultad de la suma', () => {
    const n1 = 5
    const n2 = 10
    const resultado = sumar(n1, n2)
    expect(resultado).toBe(15)
  })
})