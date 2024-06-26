function foo( e )
{
    // alert();
    return false;
}

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
    closeApp: function()
    {
        $("#float-app").hide("fade", {
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
    processDeleteFailed: function( errorCode )
    {
        $("#float-alert .alert-button .button-primary").removeClass("disabled");
        $("#float-alert .alert-button .button-primary").attr("disabled", false);

        setTimeout( function() {
            $("#float-alert div").hide("fade", 500);
            setTimeout( function() {
                $("#float-alert .alert-button .button-danger").remove();
                $("#float-alert .alert-desc").html(`Terjadi kesalahan [${errorCode}]. Error kode: ${errorCode}-111.`);
                $("#float-alert .alert-button .button-primary").html("Tutup");
                $("#float-alert div").show("fade", 500);
            }, 500);
        }, 1000);
    },
    processDeleteSuccess: function()
    {
        setTimeout( function() {
            $("#float-alert div").hide("fade", 500);
            setTimeout( function() {
                    $("#float-alert").css({ alignItems: "center" });
                    $("#float-alert").html(`<span class="d-none">Data berhasil dihapus</a>`);
                    $("#float-alert span").show("fade", 500);
                    setTimeout( function() {
                        appFloat.closeAlert();
                        setTimeout( function()
                        {
                            $("#float-alert").css({ alignItems: "normal" });
                        }, 1000);
                    }, 1500);
            }, 500);
        }, 1000);
    },
    processDelete: function( id )
    {
        $("#float-alert .alert-button .button-primary").addClass("disabled");
        $("#float-alert .alert-button .button-danger").addClass("disabled");
        $("#float-alert .alert-button .button-primary").attr("disabled", true);
        $("#float-alert .alert-button .button-danger").attr("disabled", true);

        $("#appAlertConfirmButton span").hide("fade", 300);
        setTimeout( function()
        {
            $("#appAlertConfirmButton span").html(`<div class="spinner"></div>`);
            $("#appAlertConfirmButton span").show("fade", 300);

            // appFloat.processSuccess();
            $.ajax({
                url: `/project/delete?id=${id}`,
                type: "POST",
                headers: { "X-CSRF-Token": G_csrfToken },
                statusCode:
                {
                    200: ( response, status, xhr ) =>
                    {
                        appFloat.processDeleteSuccess();
                        setTimeout( function() {
                            javascript:table.redraw();
                        }, 3000);
                    },
                    400: ( response ) =>
                    {
                        appFloat.processDeleteFailed(400);
                    },
                    404: ( response ) =>
                    {
                        appFloat.processDeleteFailed(404);
                    },
                    500: ( response ) =>
                    {
                        appFloat.processDeleteFailed(500);
                    },
                }
            });
        }, 300);
    },
    confirmDelete: function( id, title, totalEmployee, totalActivity )
    {
        // "10 Kegiatan akan terhapus bersama Desain UI, lanjut hapus?"
        // "Tidak ada kegiatan terhapus bersama Desain UI, lanjut hapus?"

        const html =
        `
            <div class="alert-desc">${totalActivity ? `${totalActivity} kegiatan akan terhapus bersama`: "Mencoba menghapus"} ${title}, lanjutkan?</div>
            <div class="alert-button">
                <div class="empty">&nbsp;</div>
                <div class="alert-same">
                    <button class="float-button button-primary" onclick="javascript:appFloat.closeAlert();">Lupakan</button>
                    <button class="float-button button-danger" id="appAlertConfirmButton" onclick="javascript:appFloat.processDelete(${id});"><span>Ya, HAPUS</span></button>
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
    processCreateFailed: function( errorCode )
    {
        setTimeout( function() {
            $("#createName, #createRate").attr("disabled", false);
            $("#float-app .inline-button .button-danger").removeClass("disabled");
            $("#float-app .inline-button .button-primary").removeClass("disabled");
            $("#float-app .inline-button .button-danger").attr("disabled", false);
            $("#float-app .inline-button .button-primary").attr("disabled", false);


            $("#float-app .inline-button .button-primary span").hide("fade", 300);

            setTimeout(function(){
                $("#float-app .inline-button .button-primary span").html(`Tambah Karyawan`);
                $("#float-app .inline-button .button-primary span").show("fade", 300);

                const titleInput = $("#createTitle").val();

                if( !titleInput.length )
                    return $("#titleNotify").html("Kolom harus terisi");

                if( titleInput.match(/[^a-zA-Z0-9\s+]/g) )
                    return $("#titleNotify").html("Isi dengan huruf, angka, atau spasi");

                if( titleInput.length < 6 || titleInput.length > 30 )
                    return $("#titleNotify").html("Kolom harus berisi 6-30 karakter");
            }, 300);

        }, 1000);
    },  
    processCreateSuccess: function()
    {
        const loading = 
        `
            <div class="app-float-main">
                <div class="success-checkmark">
                    <div class="check-icon">
                        <span class="icon-line line-tip"></span>
                        <span class="icon-line line-long"></span>
                        <div class="icon-circle"></div>
                        <div class="icon-fix"></div>
                    </div>
                </div>
                <div class="app-pop-title">Berhasil</div>
                <div class="app-pop-desc">Menambahkan proyek baru</div>
            </div>
        `;


        $("#float-app .main-float").hide("fade", 300);

        setTimeout( function() {

            $("#float-app").html(`<div class="checked-target"></div>`);

            $("#float-app").css({
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            });

            $("#float-app").animate({
                height: "300px",
                width: "500px",
            }, 500);

            $("#float-app .checked-target").hide();
            $("#float-app .checked-target").html(loading);
            $("#float-app .checked-target").show("fade", 500);

            $("#createName, #createRate").attr("disabled", false);
            $("#float-app .inline-button .button-danger").removeClass("disabled");
            $("#float-app .inline-button .button-primary").removeClass("disabled");
            $("#float-app .inline-button .button-danger").attr("disabled", false);
            $("#float-app .inline-button .button-primary").attr("disabled", false);

            setTimeout(function()
            {
                setTimeout(function()
                {
                    appFloat.closeApp();
                    setTimeout( function()
                    {
                        $("#float-app").html("");

                        $("#float-app").css({
                            height: "560px",
                            width: "1000px",
                        }, 500);

                        $("#float-app").css({
                            display: "",
                            justifyContent: "",
                            alignItems: "",
                        });

                        $("#float-app").hide();
                    }, 500);
                }, 500);
            }, 1500);
        }, 500);
    },
    processCreate: function( title )
    {
        (function()
        {
            $("#titleNotify, #rateNotify").html("");
        })();

        $("#createName, #createRate").attr("disabled", true);
        $("#float-app .inline-button .button-danger").addClass("disabled");
        $("#float-app .inline-button .button-primary").addClass("disabled");
        $("#float-app .inline-button .button-danger").attr("disabled", true);
        $("#float-app .inline-button .button-primary").attr("disabled", true);


        $("#float-app .inline-button .button-primary span").hide("fade", 300);

        setTimeout(function(){
            $("#float-app .inline-button .button-primary span").html(`<div class="spinner"></div>`);
            $("#float-app .inline-button .button-primary span").show("fade", 300);
        }, 300);

        let dataReq = new FormData();
        dataReq.append("title", title);

        $.ajax({
            url: `/project/create`,
            type: "POST",
            processData: false,
            contentType: false,
            // dataType: "multipart/form-data",
            data: dataReq,
            headers: { "X-CSRF-Token": G_csrfToken },
            statusCode:
            {
                200: ( response, status, xhr ) =>
                {
                    appFloat.processCreateSuccess();
                    setTimeout( function() {
                        javascript:table.redraw();
                    }, 3000);
                },
                400: ( response ) =>
                {
                    appFloat.processCreateFailed(400);
                },
                500: ( response ) =>
                {
                    appFloat.processCreateFailed(500);
                },
            }
        });
    },
    confirmCreate: function( title )
    {
        // const htmlx =
        // `
        //     <div class="window-top">
        //         <div>Tambah Kegiatan Baru</div>
        //         <div class="close-float" onclick="javascript:hideAddActivity();"><i class="bi bi-x-lg"></i></div>
        //     </div>
        //     <div class="window-content">
        //         <div class="date-content">
        //             <div class="date-wrap">
        //                 <span class="float-title">Tanggal mulai <span class="text-danger">*</span></span>
        //                 <div class="datetime-target">
        //                     <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-calendar-minus-fill"></i></span></div>
        //                     <span class="text-danger text-small">Kolom harus terisi</span>
        //                 </div>
        //             </div>

        //             <div class="date-wrap">
        //                 <span class="float-title">Tanggal berakhir <span class="text-danger">*</span></span>
        //                 <div class="datetime-target">
        //                     <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-calendar-minus-fill"></i></span></div>
        //                     <span class="text-danger text-small">Kolom harus terisi</span>
        //                 </div>
        //             </div>

        //             <div class="date-wrap">
        //                 <span class="float-title">Jam mulai <span class="text-danger">*</span></span>
        //                 <div class="datetime-target">
        //                     <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-clock"></i></span></div>
        //                     <span class="text-danger text-small">Kolom harus terisi</span>
        //                 </div>
        //             </div>

        //             <div class="date-wrap">
        //                 <span class="float-title">Jam berakhir <span class="text-danger">*</span></span>
        //                 <div class="datetime-target">
        //                     <div class="date-box"><span><input type="" name=""></span><span><i class="bi bi-clock"></i></span></div>
        //                     <span class="text-danger text-small">Kolom harus terisi</span>
        //                 </div>
        //             </div>
        //         </div>
        //         <div class="title-activity">
        //             <span class="float-title">Judul kegiatan <span class="text-danger">*</span></span>
        //             <div class="form-control">
        //                 <input type="" name="">
        //                 <small class="text-danger">Kolom harus terisi</small>
        //             </div>
        //         </div>
        //         <div class="title-project">
        //             <span class="float-title">Nama proyek <span class="text-danger">*</span></span>
        //             <div class="form-control">
        //                 <select class="form-select" aria-label="Default select example">
        //                     <option value="1" selected>Pilih salah satu proyek</option>
        //                     <option value="1">10</option>
        //                     <option value="2">25</option>
        //                     <option value="3">50</option>
        //                 </select>
        //                 <small class="text-danger">Kolom harus terisi</small>
        //             </div>
        //         </div>
        //         <div class="float-save">
        //             <span class="text-danger">* Wajib diisi</span>
        //             <span class="inline-button">
        //                 <span class="float-button button-danger" onclick="javascript:hideAddActivity();">Lupakan</span>
        //                 <span class="float-button button-primary">Buat kegiatan</span>
        //             </span>
        //         </div>
        //     </div>
        // `;

        const html =
        `
            <div class="main-float">
                <div class="window-top">
                    <div>Tambah Proyek Baru</div>
                    <div class="close-float" onclick="javascript:appFloat.closeApp();"><i class="bi bi-x-lg"></i></div>
                </div>
                <div class="window-content">
                    <div class="title-activity" style="margin-bottom: 180px;">
                        <span class="float-title">Nama proyek <span class="text-danger">*</span></span>
                        <div class="form-control">
                            <input type="" id="createTitle" name="title">
                            <small id="titleNotify" class="text-danger"></small>
                        </div>
                    </div>
                    <div class="float-save-employee">
                        <span class="text-danger">* Wajib diisi</span>
                        <span class="inline-button">
                            <button class="float-button button-danger" onclick="javascript:appFloat.closeApp();">Batal</button>
                            <button value="submit" class="float-button button-primary" onclick="javascript:appFloat.processCreate($('#createTitle').val());"><span>Tambah Proyek</span></button>
                        </span>
                    </div>
                </div>
            </div>
        `;

        $("#float-container").show();
        $("#float-container").animate({
            opacity: 1,
        }, 150);

        setTimeout( function()
        {
            $("#float-app").html(html);
            $("#float-app").show("fade", {
                direction: "top"
            }, 300);
        }, 250);
    },
    processEditFailed: function( errorCode )
    {
        setTimeout( function() {
            $("#editName, #editRate").attr("disabled", false);
            $("#float-app .inline-button .button-danger").removeClass("disabled");
            $("#float-app .inline-button .button-primary").removeClass("disabled");
            $("#float-app .inline-button .button-danger").attr("disabled", false);
            $("#float-app .inline-button .button-primary").attr("disabled", false);


            $("#float-app .inline-button .button-primary span").hide("fade", 300);

            setTimeout(function(){
                $("#float-app .inline-button .button-primary span").html(`Ubah Data`);
                $("#float-app .inline-button .button-primary span").show("fade", 300);

                const nameInput = $("#editTitle").val();

                if( !nameInput.length )
                    return $("#titleNotify").html("Kolom harus terisi");

                if( nameInput.match(/[^a-zA-Z0-9\s+]/g) )
                    return $("#titleNotify").html("Isi dengan huruf, angka, atau spasi");

                if( nameInput.length < 6 || nameInput.length > 30 )
                    return $("#titleNotify").html("Kolom harus berisi 6-30 karakter");
            }, 300);

        }, 1000);
    },  
    processEditSuccess: function()
    {
        const loading = 
        `
            <div class="app-float-main">
                <div class="success-checkmark">
                    <div class="check-icon">
                        <span class="icon-line line-tip"></span>
                        <span class="icon-line line-long"></span>
                        <div class="icon-circle"></div>
                        <div class="icon-fix"></div>
                    </div>
                </div>
                <div class="app-pop-title">Berhasil</div>
                <div class="app-pop-desc">Merubah data proyek</div>
            </div>
        `;


        $("#float-app .main-float").hide("fade", 300);

        setTimeout( function() {

            $("#float-app").html(`<div class="checked-target"></div>`);

            $("#float-app").css({
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            });

            $("#float-app").animate({
                height: "300px",
                width: "500px",
            }, 500);

            $("#float-app .checked-target").hide();
            $("#float-app .checked-target").html(loading);
            $("#float-app .checked-target").show("fade", 500);

            $("#editName, #editRate").attr("disabled", false);
            $("#float-app .inline-button .button-danger").removeClass("disabled");
            $("#float-app .inline-button .button-primary").removeClass("disabled");
            $("#float-app .inline-button .button-danger").attr("disabled", false);
            $("#float-app .inline-button .button-primary").attr("disabled", false);

            setTimeout(function()
            {
                setTimeout(function()
                {
                    appFloat.closeApp();
                    setTimeout( function()
                    {
                        $("#float-app").html("");

                        $("#float-app").css({
                            height: "560px",
                            width: "1000px",
                        }, 500);

                        $("#float-app").css({
                            display: "",
                            justifyContent: "",
                            alignItems: "",
                        });

                        $("#float-app").hide();
                    }, 500);
                }, 500);
            }, 1500);
        }, 500);
    },
    processEdit: function( id, title )
    {
        (function()
        {
            $("#titleNotify, #rateNotify").html("");
        })();

        $("#editName, #editRate").attr("disabled", true);
        $("#float-app .inline-button .button-danger").addClass("disabled");
        $("#float-app .inline-button .button-primary").addClass("disabled");
        $("#float-app .inline-button .button-danger").attr("disabled", true);
        $("#float-app .inline-button .button-primary").attr("disabled", true);


        $("#float-app .inline-button .button-primary span").hide("fade", 300);

        setTimeout(function(){
            $("#float-app .inline-button .button-primary span").html(`<div class="spinner"></div>`);
            $("#float-app .inline-button .button-primary span").show("fade", 300);
        }, 300);

        let dataReq = new FormData();
        dataReq.append("id", id);
        dataReq.append("title", title);

        $.ajax({
            url: `/project/edit`,
            type: "POST",
            processData: false,
            contentType: false,
            // dataType: "multipart/form-data",
            data: dataReq,
            headers: { "X-CSRF-Token": G_csrfToken },
            statusCode:
            {
                200: ( response, status, xhr ) =>
                {
                    appFloat.processEditSuccess();
                    setTimeout( function() {
                        javascript:table.redraw();
                    }, 3000);
                },
                400: ( response ) =>
                {
                    appFloat.processEditFailed(400);
                },
                500: ( response ) =>
                {
                    appFloat.processEditFailed(500);
                },
            }
        });
    },
    confirmEdit: function( id, title )
    {
        const html =
        `
            <div class="main-float">
                <div class="window-top">
                    <div>Ubah Data ${title}</div>
                    <div class="close-float" onclick="javascript:appFloat.closeApp();"><i class="bi bi-x-lg"></i></div>
                </div>
                <div class="window-content">
                    <input type="hidden" id="editId" name="id" value="${id}">
                    <div class="title-activity" style="margin-bottom: 180px;">
                        <span class="float-title">Nama karyawan <span class="text-danger">*</span></span>
                        <div class="form-control">
                            <input type="" id="editTitle" name="name" value="${title}">
                            <small id="titleNotify" class="text-danger"></small>
                        </div>
                    </div>
                    <div class="float-save-employee">
                        <span class="text-danger">* Wajib diisi</span>
                        <span class="inline-button">
                            <button class="float-button button-danger" onclick="javascript:appFloat.closeApp();">Batal</button>
                            <button value="submit" class="float-button button-primary" onclick="javascript:appFloat.processEdit(${id}, $('#editTitle').val());"><span>Ubah Data</span></button>
                        </span>
                    </div>
                </div>
            </div>
        `;

        $("#float-container").show();
        $("#float-container").animate({
            opacity: 1,
        }, 150);

        setTimeout( function()
        {
            $("#float-app").html(html);
            $("#float-app").show("fade", {
                direction: "top"
            }, 300);
        }, 250);
    }
}

const stringHelper =
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
    input_money: function( context )
    {
        let value = context.value;
        value = value.replace(/\,/g, "");

        if( value.length )
        {
            if(! value.match(/^(0|[1-9][0-9]*)$/g) )
                value = value.substring(0, value.length - 1);
            $(context).val(stringHelper.number_format(value.replace(/\,/g, "")));
        }
    },
    convert_money: function( number )
    {
        number = number.replace(/\,|\./g, "");
        return stringHelper.number_format(number);
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
    query_order_by: "title",
    query_sort_by: "asc",
    query_total_activity: false,
    min_page: 1,
    max_page: 1,
    disable_page: false,
    order: function( context, order_by, sort_by )
    {
        $(`#titleSort`).attr("onclick", `javascript:table.order(this, 'title', 'desc')`)
        $(`#totalEmployeeSort`).attr("onclick", `javascript:table.order(this, 'total_employee', 'desc')`)
        $(`#totalActivitySort`).attr("onclick", `javascript:table.order(this, 'total_activity', 'desc')`)
        $(`.filter-sort`).html(`<i class="bi bi-sort-down-alt"></i>`);

        switch( sort_by )
        {
            case "asc":
                $(context).attr("onclick", `javascript:table.order(this, '${order_by}', 'desc')`)
                $(context).html(`<i class="bi bi-sort-down-alt"></i>`);
            break;
            case "desc":
                $(context).attr("onclick", `javascript:table.order(this, '${order_by}', 'asc')`)
                $(context).html(`<i class="bi bi-sort-up-alt"></i>`);
            break;
        }

        switch( order_by )
        {
            case "title":
            case "total_employee":
            case "total_activity":
                table.query_order_by = order_by;
                table.query_sort_by = sort_by;
                table.targetPage(table.query_page, table.query_limit, table.query_search);
                // alert();
            break;
            default:
            break;
        }
    },
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
                page = table.max_page ? table.max_page : 1;

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
        urlBrowserBar.set(`/project?page=${target}&limit=${limit}` + ( table.query_search !== "" ? `&search=${table.query_search}` : "" ) +`&order_by=${table.query_order_by}&sort_by=${table.query_sort_by}`);
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
            url: `/project/list?page=${page}&limit=${limit}&search=${table.query_search}&order_by=${table.query_order_by}&sort_by=${table.query_sort_by}`,
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
                if( (table.query_search).length )
                {
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
                }
                else
                {
                    $(".table-body-placeholder").hide();
                    $(".cards-message-info").show();
                    $(".table-body").append(`
                        <tr><td colspan="4"></td></tr>
                        <tr><td colspan="4"></td></tr>
                        <tr><td colspan="4"></td></tr>
                        <tr><td colspan="4"></td></tr>
                        <tr><td colspan="4" style="text-align: center;">Belum ada proyek</td></tr>
                        <tr><td colspan="4"></td></tr>
                        <tr><td colspan="4"></td></tr>
                        <tr><td colspan="4"></td></tr>
                        <tr><td colspan="4"></td></tr>
                        <tr><td colspan="4"></td></tr>
                    `);
                }
            break;
            default:
                let data = response.data;

                for( let i = 0; i < data.length; i += 1 )
                {
                    currator -= 1;

                    const totalEmployee = parseInt(data[i].total_employee);
                    const totalActivity = parseInt(data[i].total_activity);
                    let row = `
                    	<tr>
	                        <td>${data[i].title}</td>
	                        <td>${totalEmployee === 0 ? 'Belum ada': totalEmployee} karyawan</td>
	                        <td>${totalActivity === 0 ? 'Belum ada': totalActivity} kegiatan</td>
	                        <td>
	                            <div class="action-table">
	                                <span class="icon-pointer" onclick="javascript:appFloat.confirmEdit('${data[i].id}', '${data[i].title}');"><i class="bi bi-pencil-square edit"></i></span>
	                                <span class="icon-pointer" onclick="javascript:appFloat.confirmDelete(${data[i].id}, '${data[i].title}', ${totalEmployee}, ${totalActivity});"><i class="bi bi-trash-fill delete"></i></span>
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
                            <td colspan="4">&nbsp;</td>
	                    </tr>
            	`);
        }

        table.disable_page = false;

        if( callback )
            callback(response);
    }
}
