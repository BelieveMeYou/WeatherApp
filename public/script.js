const city = "New York"

fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`)
.then(res => res.json())                                                                                                                                                                                    
.then(data => console.log(data));