const template = data => `
    <style>@import './main.css';</style>

    <aside>
        <img src="${data.image}"/>
        <section class="info">
            <div name="name">${data.name}</div>
            <slot></slot>
            <hr>
            <a href="${data.donate}" target="_blank">Donate</a>
        </section>  
    <aside>  
`;

export default template;