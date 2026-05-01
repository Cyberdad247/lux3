export async function openTypeform() {
  if (typeof window === 'undefined') return;
  const ref = sessionStorage.getItem('lx_ref') ?? undefined;
  const { createPopup } = await import('@typeform/embed');
  const { open } = createPopup('hdu5Fujq', {
    hideHeaders: true,
    hideFooter: true,
    size: 80,
    ...(ref ? { hidden: { ref_code: ref } } : {}),
  });
  open();
}
