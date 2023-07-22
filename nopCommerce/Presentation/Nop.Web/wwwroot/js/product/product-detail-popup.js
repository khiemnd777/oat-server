console.warn('Product in detail popup');

const openDetailProductPopup = async (id, fetchUrl) => {
  console.log(`open ${id}`);
  const result = await fetchContent(fetchUrl);
  $('body').addClass('stop-scrolling');
  console.log(result);
  const $modal = $(`<div class="overlay" />`).append(
    $(`<div class="modal" />`)
      .append($(`<div class="content" />`).html(result))
      .append(
        $(`<div class="close_btn" />`).on('click.close', () => {
          $('body').removeClass('stop-scrolling');
          $modal.remove();
        })
      )
  );

  $('body').append($modal);
};

const fetchContent = async (fetchUrl) => {
  return await new Promise((resolve, reject) => {
    $.ajax({
      cache: false,
      url: fetchUrl,
      type: 'GET',
      success: (response) => {
        resolve(response);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
};
