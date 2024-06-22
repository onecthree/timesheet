const appFloat =
{
    closeAlert: function()
    {
        $("#float-alert").hide("fade", {
            direction: "top"
        }, 300);
        
        setTimeout( function()
        {
            $("#float-container").animate({
                opacity: 0,
            }, 200);

            setTimeout( function()
            {
                $("#float-container").hide();
            }, 400);
        }, 300);
    },
    confirmDelete: function( name )
    {
        const html =
        `
            <div class="alert-desc">Hapus keryawan "${name}"?</div>
            <div class="alert-button">
                <div>&nbsp;</div>
                <div class="alert-same">
                    <button class="float-button button-danger" onclick="javascript:appFloat.closeAlert();">Lupakan</button>
                    <button class="float-button button-primary">Ya, hapus</button>
                </div>
            </div>
        `;

        $("#float-container").show();
        $("#float-container").animate({
            opacity: 1,
        }, 150);

        setTimeout( function()
        {
            $("#float-alert").html(html);
            $("#float-alert").show("fade", {
                direction: "top"
            }, 300);
        }, 250);
    },
    confirmEdit: function( name )
    {
        const html =
        `
            <div class="window-top">
                <div>Tambah Kegiatan Baru</div>
                <div class="close-float" onclick="javascript:hideAddActivity();"><i class="bi bi-x-lg"></i></div>
            </div>
            <div class="window-content">
                <div class="date-content">
                    <div class="date-wrap">
                        <span class="float-title">Tanggal mulai <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-calendar-minus-fill"></i></span></div>
                            <span class="text-danger text-small">Kolom harus terisi</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Tanggal berakhir <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-calendar-minus-fill"></i></span></div>
                            <span class="text-danger text-small">Kolom harus terisi</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Jam mulai <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-clock"></i></span></div>
                            <span class="text-danger text-small">Kolom harus terisi</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Jam berakhir <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-clock"></i></span></div>
                            <span class="text-danger text-small">Kolom harus terisi</span>
                        </div>
                    </div>
                </div>
                <div class="title-activity">
                    <span class="float-title">Judul kegiatan <span class="text-danger">*</span></span>
                    <div class="form-control">
                        <input type="" name="">
                        <small class="text-danger">Kolom harus terisi</small>
                    </div>
                </div>
                <div class="title-project">
                    <span class="float-title">Nama proyek <span class="text-danger">*</span></span>
                    <div class="form-control">
                        <select class="form-select" aria-label="Default select example">
                            <option value="1" selected>Pilih salah satu proyek</option>
                            <option value="1">10</option>
                            <option value="2">25</option>
                            <option value="3">50</option>
                        </select>
                        <small class="text-danger">Kolom harus terisi</small>
                    </div>
                </div>
                <div class="float-save">
                    <span class="text-danger">* Wajib diisi</span>
                    <span class="inline-button">
                        <span class="float-button button-danger" onclick="javascript:hideAddActivity();">Lupakan</span>
                        <span class="float-button button-primary">Buat kegiatan</span>
                    </span>
                </div>
            </div>
        `;

        console.log(html);

        $("#float-app").html(html);
    }
}

const float =
{
    employee: function()
    {
        const html =
        `
            <div class="window-top">
                <div>Tambah Kegiatan Baru</div>
                <div class="close-float" onclick="javascript:hideAddActivity();"><i class="bi bi-x-lg"></i></div>
            </div>
            <div class="window-content">
                <div class="date-content">
                    <div class="date-wrap">
                        <span class="float-title">Tanggal mulai <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-calendar-minus-fill"></i></span></div>
                            <span class="text-danger text-small">Kolom harus terisi</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Tanggal berakhir <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-calendar-minus-fill"></i></span></div>
                            <span class="text-danger text-small">Kolom harus terisi</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Jam mulai <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-clock"></i></span></div>
                            <span class="text-danger text-small">Kolom harus terisi</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Jam berakhir <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-clock"></i></span></div>
                            <span class="text-danger text-small">Kolom harus terisi</span>
                        </div>
                    </div>
                </div>
                <div class="title-activity">
                    <span class="float-title">Judul kegiatan <span class="text-danger">*</span></span>
                    <div class="form-control">
                        <input type="" name="">
                        <small class="text-danger">Kolom harus terisi</small>
                    </div>
                </div>
                <div class="title-project">
                    <span class="float-title">Nama proyek <span class="text-danger">*</span></span>
                    <div class="form-control">
                        <select class="form-select" aria-label="Default select example">
                            <option value="1" selected>Pilih salah satu proyek</option>
                            <option value="1">10</option>
                            <option value="2">25</option>
                            <option value="3">50</option>
                        </select>
                        <small class="text-danger">Kolom harus terisi</small>
                    </div>
                </div>
                <div class="float-save">
                    <span class="text-danger">* Wajib diisi</span>
                    <span class="inline-button">
                        <span class="float-button button-danger" onclick="javascript:hideAddActivity();">Lupakan</span>
                        <span class="float-button button-primary">Buat kegiatan</span>
                    </span>
                </div>
            </div>
        `;
    }
}

const string =
{
    number_format: function( number, delimiter = "," )
    {
        numberModified = "";
        numberLength = number.length;
        digit = numberLength % 3 || 3;

        for( i = 0; i < numberLength; i += 1 )
        {
            digit -= 1;
            numberModified += number[i];

            if(! digit && (numberLength - i - 1) )
            {
                numberModified += delimiter;
                digit = 3;
            }
        }

        return numberModified;
    },
};

const urlBrowserBar = 
{
    set: function( url )
    {
        history.pushState({}, "", url);
    }
}

const paginate = 
{
    clear: function()
    {
        $(".pagination").html("");
    },
    append: function( page )
    {
        $(".pagination").append(`<button class="btn btn-secondary btn-current" onclick="javascript:table.targetPage(${page}, table.query_limit);">${page}</button>`);
    },
    current: function( page )
    {
        $(".pagination").append(`<button class="btn btn-secondary disabled">${page}</button>`);
    },
    skip: function( page )
    {
        $(".pagination").append(`<span class="page-skip">${page}</span>`);
    }
}

const table =
{
    query_page: 1,
    query_limit: 10,
    query_search: "",
    query_total_activity: false,
    min_page: 1,
    max_page: 1,
    disable_page: false,
    redraw: function()
    {
        const button = $("#redrawIcon");
        button.addClass("rotating");        

        setTimeout(() => {
            table.targetPage(table.query_page, table.query_limit, function()
            {
                button.on("animationiteration webkitAnimationIteration", function() {
                    $(this).removeClass("rotating");
                });
            });
        }, 1000);

    },
    targetPage: function( page, limit, callback = null )
    {
        if(! table.disable_page )
        {
            table.disable_page = true;

            if( page > table.max_page )
                page = table.max_page;

            table.query_page = page;
            table.load(page, limit, function( response )
            {
                page = parseInt(page);
                limit = parseInt(limit);
                total = parseInt(response.total);

                for( ;; )
                {
                    if( ((page-1) * limit) <= total )
                    {
                        console.log(page, limit, total);
                        break;
                    }

                    page -= 1
                }

                table.query_page = page;
                table.query_limit = limit;
                table.setPagination(page, limit);

                if( typeof callback === "function" )
                    callback();
            });
            
            $(".btn-before-page, .btn-next-page").removeClass("disabled");

            if( table.query_page <= table.min_page )
                $(".btn-before-page").addClass("disabled");

            if( table.query_page >= table.max_page )
                $(".btn-next-page").addClass("disabled");
        }
    },
    beforePage: function()
    {
        if( table.query_page <= 1 )
            table.targetPage(1, table.query_limit);
        else
            table.targetPage(table.query_page - 1, table.query_limit);
    },
    nextPage: function()
    {
        if( table.query_page >= table.max_page )
            table.targetPage(table.max_page, table.query_limit);
        else
            table.targetPage(table.query_page + 1, table.query_limit);
    },
    setPagination: function ( target, limit )
    {
        urlBrowserBar.set(`/employee?page=${target}&limit=${limit}` + ( table.query_search !== "" ? `&search=${table.query_search}` : "" ));
        paginate.clear();
        const pages = table.pageOrder(target, table.max_page, limit);
        pages.map( page => {
            if( page === null )
                return paginate.skip("...");
            
            if( page === target )
                return paginate.current(page);

            paginate.append(page);
        });
    },
    pageOrder: function( current, max, skip = 7 )
    {
        let stack = [];

        if( max > skip )
        {
            if( current < 5 )
            {
                for( let i = 1; i <= 5; i += 1 )
                    stack.push(i);
                stack.push(null);
                stack.push(max);
            }
            else
            if( (max - current) < 4 )
            {
                stack.push(1);
                stack.push(null);
                for( let i = max - 4; i <= max; i += 1 )
                    stack.push(i);
            }
            else
            {
                stack.push(1);
                stack.push(null);
                stack.push(current - 1);
                stack.push(current);
                stack.push(current + 1);
                stack.push(null);
                stack.push(max);
            }
        }
        else
        {
            for( let i = 1; i <= max; i += 1 )
                stack.push(i);
        }

        return stack;
    },
    load: function( page, limit, callback = null )
    {
        $(".table-body").html("");
        $(".table-body-placeholder").show();

        table.query_page = page;
        
        $.ajax({
            url: `/employee/list?page=${page}&limit=${limit}&search=${table.query_search}`,
            type: "POST",
            headers: { "X-CSRF-Token": G_csrfToken },
            statusCode:
            {
                200: ( response, status, xhr ) =>
                {
                    G_csrfToken = xhr.getResponseHeader("X-CSRF-Token");
                    setTimeout(() => {
                        table.max_page = response.maxPage;
                        table.clear(response, callback);
                        $(`.page`).removeClass("disabled");
                        $(`.page-${page}`).addClass("disabled");
                    }, 300);
                },
                403: ( response ) =>
                {
                    $(".tb-message-center #message").html("Terjadi kesalahan [403]. Silahkan ulang kembali.");
                    $(".tb-placeholder").hide();
                    $(".tb-message-center").show();
                },
            }
        });
    },
    icon_switch: function( state )
    {
        if( state )
            return `
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-toggle-on" viewBox="0 0 16 16">
                <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
                </svg>
            `;
        else
            return `
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-toggle-off" viewBox="0 0 16 16">
                <path d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z"/>
                </svg>
            `;
    },
    clear: function( response, callback = null )
    {
        $(".table-body-placeholder").hide();
        $(".cards").show();
        let currator = 10;

      	console.log(response.total)

        switch( parseInt(response.total) )
        {
            case 0:
                $(".table-body-placeholder").hide();
                $(".cards-message-info").show();
                $(".table-body").append(`
                    <tr><td colspan="4"></td></tr>
                    <tr><td colspan="4"></td></tr>
                    <tr><td colspan="4"></td></tr>
                    <tr><td colspan="4"></td></tr>
                    <tr><td colspan="4" style="text-align: center;">Tidak menemukan data untuk pencarian "${table.query_search}"</td></tr>
                    <tr><td colspan="4"></td></tr>
                    <tr><td colspan="4"></td></tr>
                    <tr><td colspan="4"></td></tr>
                    <tr><td colspan="4"></td></tr>
                    <tr><td colspan="4"></td></tr>
                `);
            break;
            default:
                let data = response.data;

                for( let i = 0; i < data.length; i += 1 )
                {
                    currator -= 1;

                    const totalActivity = parseInt(data[i].total_activity);
                    let row = `
                    	<tr>
	                        <td>${data[i].name}</td>
	                        <td>Rp${string.number_format((data[i].rate).replace(/\..*$/g, ""))},-</td>
	                        <td>${totalActivity === 0 ? 'Belum ada': totalActivity} kegiatan</td>
	                        <td>
	                            <div class="action-table">
	                                <span class="icon-pointer" onclick="javascript:appFloat.confirmEdit('${data[i].name}');"><i class="bi bi-pencil-square edit"></i></span>
	                                <span class="icon-pointer" onclick="javascript:appFloat.confirmDelete('${data[i].name}');"><i class="bi bi-trash-fill delete"></i></span>
	                            </div>
	                        </td>
	                    </tr>
                    `;

                    $(".table-body").append(row);
                }
            break;
        }

        if( parseInt(response.total) )
        {
            for( let i = 0; i < currator; i += 1 )
                $(".table-body").append(`
						<tr>
	                        <td>&nbsp;</td>
	                        <td>&nbsp;</td>
	                        <td>&nbsp;</td>
	                        <td>&nbsp;</td>
	                    </tr>
            	`);
        }

        table.disable_page = false;

        if( callback )
            callback(response);
    }
}
