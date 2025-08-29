export const $ = (sel, ctx=document) => ctx.querySelector(sel);
export const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

export const money = (n, currency='ARS', locale='es-AR') =>
  new Intl.NumberFormat(locale, { style:'currency', currency }).format(n);

export const toast = (title, icon='success') => {
  if (window.Swal) {
    Swal.fire({ title, icon, timer:1600, showConfirmButton:false, position:'top', toast:true })
  }
};

export const confirm = async (title, text='') => {
  if (window.Swal) {
    const res = await Swal.fire({
      title, text, icon:'question', showCancelButton:true,
      confirmButtonText:'Sí', cancelButtonText:'Cancelar'
    });
    return res.isConfirmed;
  }
  return false;
};

export const card = (html) => {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = html;
  return div;
};