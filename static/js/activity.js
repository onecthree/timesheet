function foo( e )
{
    // alert();
    return false;
}

const roles =
{
    select: function( id, name )
    {
        G_onRoleSelected = true;
        $("#roleInput").val(name);
        $("input[name=project_id]").val(id);
    },
    request: function( keyword )
    {
        $.ajax({
            url: `/project/search?k=${keyword}`,
            type: "POST",
            statusCode:
            {
                200: function( response, status, xhr )
                {
                    G_csrfToken = xhr.getResponseHeader("X-CSRF-Token");
                    let elem = "";  
                    response.data.forEach(( value, index ) =>
                    {
                        elem +=  `<div class="role-result-line" onclick="javascript:roles.select(\`${value.id}\`, \`${value.title}\`);">
                            <div class="role-name">${value.title}</div>
                        </div>`;
                    });

                    // console.log("ADA", elem);
                    if( elem.length !== 0 )
                    {
                        $("#roleSearchResult").html(elem);
                    }
                    else
                    {
                        $("#roleSearchResult").html(`<div class="role-result-line">
                            <div class="role-name text-muted">Tidak ditemukan</div>
                        </div>`);
                    }

                    $("#roleSearchResult").show("blind");
                },  
                400: function( response )
                {
                    // G_csrfToken = response.getResponseHeader("X-CSRF-Token");
                    $("#roleSearchResult").html(`<div class="role-result-line">
                        <div class="role-name text-muted">Ketik untuk pencarian</div>
                    </div>`);
                },
            },
        });
    },
    input: function( keyword )
    {
        G_onRoleSearchState += 1;
        setTimeout(() => {
            if( G_onRoleSearchState === 1 )
            {
                roles.request(keyword);
            }
            G_onRoleSearchState -= 1;
        }, 500);   
    }
}

const dateFocus =
{
    begin: function()
    {
        $("#datepickerStartField").focus();
    },
    end: function()
    {
        $("#datepickerEndField").focus();
    }
}

const timeFocus =
{
    begin: function()
    {
        $("#timepickerStartField").focus();
    },
    end: function()
    {
        $("#timepickerEndField").focus();
    }
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
                url: `/activity/delete?id=${id}`,
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
    confirmDelete: function( id, title )
    {
        // "10 Kegiatan akan terhapus bersama Desain UI, lanjut hapus?"
        // "Tidak ada kegiatan terhapus bersama Desain UI, lanjut hapus?"

        const html =
        `
            <div class="alert-desc">Mencoba menghapus ${title}, lanjutkan?</div>
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

                const titleInput = $("#titleInput").val();
                const dateStart = $("#datepickerStartField").val();
                const dateEnd = $("#datepickerEndField").val();
                const timeStart = $("#timepickerStartField").val();
                const timeEnd = $("#timepickerEndField").val();
                const projectId = $("#projectInput").val();

                console.log("TIME TIME", timeStart, timeEnd);

                if( dateStart.length === 0 )
                    return $("#dateStartNotify").html("Kolom harus terisi");

                if(! moment(dateStart, "DD/MM/YYYY", true).isValid() )
                    return $("#timeStartNotify").html("Format tidak didukung");

                if( dateEnd.length === 0 )
                    return $("#dateEndNotify").html("Kolom harus terisi");

                if(! moment(dateEnd, "DD/MM/YYYY", true).isValid() )
                    return $("#timeStartNotify").html("Format tidak didukung");

                if( timeStart.length === 0 )
                    return $("#timeStartNotify").html("Kolom harus terisi");

                if(! timeStart.match(/^([01][0-9]|2[0-3]):([0-5][0-9])$/g) )
                    return $("#timeStartNotify").html("Format tidak didukung");

                if( timeEnd.length === 0 )
                    return $("#timeEndNotify").html("Kolom harus terisi");

                if(! timeEnd.match(/^([01][0-9]|2[0-3]):([0-5][0-9])$/g) )
                    return $("#timeStartNotify").html("Format tidak didukung");

                if( !titleInput.length )
                    return $("#titleNotify").html("Kolom harus terisi");

                if( titleInput.match(/[^a-zA-Z0-9\s+]/g) )
                    return $("#titleNotify").html("Isi dengan huruf, angka, atau spasi");

                if( titleInput.length < 6 || titleInput.length > 30 )
                    return $("#titleNotify").html("Kolom harus berisi 6-30 karakter");

                if( projectId.length === 0 )
                    return $("#projectNotify").html("Kolom harus terisi atau proyek tidak tersedia");
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
                <div class="app-pop-desc">Menambahkan karyawan baru</div>
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
            $("#dateStartNotify, #dateEndNotify, #timeStartNotify, #timeEndNotify, #titleNotify, #projectNotify").html("&nbsp;");
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
        dataReq.append("date_start", $("input[name=date_start]").val());
        dataReq.append("date_end", $("input[name=date_end]").val());
        dataReq.append("time_start", $("input[name=time_start]").val());
        dataReq.append("time_end", $("input[name=time_end]").val());
        dataReq.append("title", $("input[name=title]").val());
        dataReq.append("project_id", $("input[name=project_id]").val());
        dataReq.append("employee_id", G_employeeId);

        $.ajax({
            url: `/activity/create`,
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
        const html =
        `
            <div class="window-top">
                <div>Tambah Kegiatan Baru</div>
                <div class="close-float" onclick="javascript:appFloat.closeApp();"><i class="bi bi-x-lg"></i></div>
            </div>
            <div class="window-content">
                <div class="date-content">
                    <div class="date-wrap">
                        <span class="float-title">Tanggal mulai <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name="date_start" class="datepicker" id="datepickerStartField" readonly></span><span onclick="javascript:dateFocus.begin();" class="icon-pointer"><i class="bi bi-calendar-minus-fill"></i></span></div>
                            <span class="text-danger text-small" id="dateStartNotify">&nbsp;</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Tanggal berakhir <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name="date_end" class="datepicker" id="datepickerEndField" readonly></span><span onclick="javascript:dateFocus.end();" class="icon-pointer"><i class="bi bi-calendar-minus-fill"></i></span></div>
                            <span class="text-danger text-small" id="dateEndNotify">&nbsp;</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Jam mulai <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name="time_start" class="timepicker" id="timepickerStartField" readonly></span><span onclick="javascript:timeFocus.begin();" class="icon-pointer"><i class="bi bi-clock"></i></span></div>
                            <span class="text-danger text-small" id="timeStartNotify">&nbsp;</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Jam berakhir <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name="time_end" class="timepicker" id="timepickerEndField" readonly></span><span onclick="javascript:timeFocus.end();" class="icon-pointer"><i class="bi bi-clock"></i></span></div>
                            <span class="text-danger text-small" id="timeEndNotify">&nbsp;</span>
                        </div>
                    </div>
                </div>
                <div class="title-activity">
                    <span class="float-title">Judul kegiatan <span class="text-danger">*</span></span>
                    <div class="form-control">
                        <input type="" name="title" id="titleInput">
                        <small class="text-danger" id="titleNotify"></small>
                    </div>
                </div>
                <div class="title-activity">
                    <span class="float-title">Nama proyek <span class="text-danger">*</span></span>
                    <div class="form-control">
                        <input type="hidden" name="project_id" id="projectInput" value="">
                        <input type="text" id="roleInput" class="form-control" placeholder="Pulsa White Coast" oninput="javascript:roles.input(this.value);">
                        <div class="parent-ww">
                            <div id="roleSearchResult" style="display: none;">
                                <div class="role-result-line">
                                    <div class="role-name text-muted">Ketik untuk pencarian</div>
                                </div>
                            </div>
                        </div>
                        <small class="text-danger" id="projectNotify"></small>
                    </div>
                </div>
                <div class="float-save">
                    <span class="text-danger">* Wajib diisi</span>
                    <span class="inline-button">
                        <button class="float-button button-danger" onclick="javascript:appFloat.closeApp();">Lupakan</span>
                        <button class="float-button button-primary" onclick="javascript:appFloat.processCreate();""><span>Buat kegiatan</span>
                        </button>
                    </span>
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

                const titleInput = $("#titleInput").val();
                const dateStart = $("#datepickerStartField").val();
                const dateEnd = $("#datepickerEndField").val();
                const timeStart = $("#timepickerStartField").val();
                const timeEnd = $("#timepickerEndField").val();
                const projectId = $("#projectInput").val();

                console.log("TIME TIME", timeStart, timeEnd);

                if( dateStart.length === 0 )
                    return $("#dateStartNotify").html("Kolom harus terisi"); // DD MMM YYYY

                if(! moment(dateStart, "DD/MM/YYYY", true).isValid() )
                    return $("#dateStartNotify").html("Format tidak didukung");

                if( dateEnd.length === 0 )
                    return $("#dateEndNotify").html("Kolom harus terisi");

                if(! moment(dateEnd, "DD/MM/YYYY", true).isValid() )
                    return $("#dateEndNotify").html("Format tidak didukung");

                if( timeStart.length === 0 )
                    return $("#timeStartNotify").html("Kolom harus terisi");

                if(! timeStart.match(/^([01][0-9]|2[0-3]):([0-5][0-9])$/g) )
                    return $("#timeStartNotify").html("Format tidak didukung");

                if( timeEnd.length === 0 )
                    return $("#timeEndNotify").html("Kolom harus terisi");

                if(! timeEnd.match(/^([01][0-9]|2[0-3]):([0-5][0-9])$/g) )
                    return $("#timeEndNotify").html("Format tidak didukung");

                if( !titleInput.length )
                    return $("#titleNotify").html("Kolom harus terisi");

                if( titleInput.match(/[^a-zA-Z0-9\s+]/g) )
                    return $("#titleNotify").html("Isi dengan huruf, angka, atau spasi");

                if( titleInput.length < 6 || titleInput.length > 30 )
                    return $("#titleNotify").html("Kolom harus berisi 6-30 karakter");

                if( projectId.length === 0 )
                    return $("#projectNotify").html("Kolom harus terisi atau proyek tidak tersedia");
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
    processEdit: function( id )
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
        dataReq.append("date_start", $("input[name=date_start]").val());
        dataReq.append("date_end", $("input[name=date_end]").val());
        dataReq.append("time_start", $("input[name=time_start]").val());
        dataReq.append("time_end", $("input[name=time_end]").val());
        dataReq.append("title", $("input[name=title]").val());
        dataReq.append("project_id", $("input[name=project_id]").val());
        dataReq.append("employee_id", G_employeeId);


        $.ajax({
            url: `/activity/edit`,
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
    confirmEdit: function( id, dateStart, dateEnd, timeStart, timeEnd, title, project_title, project_id )
    {
        console.log("MAS ANIES ", project_title, project_id)
        const html =
        `
            <div class="window-top">
                <div>Tambah Kegiatan Baru</div>
                <div class="close-float" onclick="javascript:appFloat.closeApp();"><i class="bi bi-x-lg"></i></div>
            </div>
            <div class="window-content">
                <div class="date-content">
                    <div class="date-wrap">
                        <span class="float-title">Tanggal mulai <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name="date_start" class="datepicker" id="datepickerStartField" value="${dateStart}" readonly></span><span onclick="javascript:dateFocus.begin();" class="icon-pointer"><i class="bi bi-calendar-minus-fill"></i></span></div>
                            <span class="text-danger text-small" id="dateStartNotify">&nbsp;</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Tanggal berakhir <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name="date_end" class="datepicker" id="datepickerEndField" value="${dateEnd}" readonly></span><span onclick="javascript:dateFocus.end();" class="icon-pointer"><i class="bi bi-calendar-minus-fill"></i></span></div>
                            <span class="text-danger text-small" id="dateEndNotify">&nbsp;</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Jam mulai <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name="time_start" class="timepicker" id="timepickerStartField" value="${timeStart}" readonly></span><span onclick="javascript:timeFocus.begin();" class="icon-pointer"><i class="bi bi-clock"></i></span></div>
                            <span class="text-danger text-small" id="timeStartNotify">&nbsp;</span>
                        </div>
                    </div>

                    <div class="date-wrap">
                        <span class="float-title">Jam berakhir <span class="text-danger">*</span></span>
                        <div class="datetime-target">
                            <div class="date-box"><span><input type="" name="time_end" class="timepicker" id="timepickerEndField" value="${timeEnd}" readonly></span><span onclick="javascript:timeFocus.end();" class="icon-pointer"><i class="bi bi-clock"></i></span></div>
                            <span class="text-danger text-small" id="timeEndNotify">&nbsp;</span>
                        </div>
                    </div>
                </div>
                <div class="title-activity">
                    <span class="float-title">Judul kegiatan <span class="text-danger">*</span></span>
                    <div class="form-control">
                        <input type="" name="title" id="titleInput" value="${title}">
                        <small class="text-danger" id="titleNotify"></small>
                    </div>
                </div>
                <div class="title-activity">
                    <span class="float-title">Nama proyek <span class="text-danger">*</span></span>
                    <div class="form-control">
                        <input type="hidden" name="project_id" id="projectInput" value="${project_id}">
                        <input type="text" id="roleInput" class="form-control" placeholder="Pulsa White Coast" value="${project_title}" oninput="javascript:roles.input(this.value);">
                        <div class="parent-ww">
                            <div id="roleSearchResult" style="display: none;">
                                <div class="role-result-line">
                                    <div class="role-name text-muted">Ketik untuk pencarian</div>
                                </div>
                            </div>
                        </div>
                        <small class="text-danger" id="projectNotify"></small>
                    </div>
                </div>
                <div class="float-save">
                    <span class="text-danger">* Wajib diisi</span>
                    <span class="inline-button">
                        <button class="float-button button-danger" onclick="javascript:appFloat.closeApp();">Lupakan</span>
                        <button class="float-button button-primary" onclick="javascript:appFloat.processEdit(${id});""><span>Ubah data</span>
                        </button>
                    </span>
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
        number = number.replace(/\,|\..*$/g, "");
        return stringHelper.number_format(number);
    },
};

const urlBrowserBar = 
{
    set: function( url )
    {
        const pathname = window.location.pathname;
        history.pushState({}, "", pathname + url);
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
    query_order_by: "name",
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
        urlBrowserBar.set(`?page=${target}&limit=${limit}` + ( table.query_search !== "" ? `&search=${table.query_search}` : "" ) +`&order_by=${table.query_order_by}&sort_by=${table.query_sort_by}`);
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
        const pathname = window.location.pathname;
        
        $.ajax({
            url: `/activity/list/${pathname.replace(/\/activity\//g, "")}?page=${page}&limit=${limit}&search=${table.query_search}&order_by=${table.query_order_by}&sort_by=${table.query_sort_by}`,
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
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8" style="text-align: center;">Tidak menemukan data untuk pencarian "${table.query_search}"</td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                    `);
                }
                else
                {
                    $(".table-body-placeholder").hide();
                    $(".cards-message-info").show();
                    $(".table-body").append(`
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8" style="text-align: center;">Belum ada karyawan</td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
                        <tr><td colspan="8"></td></tr>
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

                    const dateStart = moment(data[i].date_start, "YYYY-MM-DD HH:mm:s");
                    const dateEnd = moment(data[i].date_end, "YYYY-MM-DD HH:mm:s");
                    const timeStart = moment(data[i].time_start, "HH:mm:s").format("HH:mm");
                    const timeEnd = moment(data[i].time_end, "HH:mm:s").format("HH:mm");
                    let row = `
                    	<tr>
	                        <td>${data[i].title}</td>
	                        <td>${data[i].project_title}</td>
                            <td>${dateStart.format("DD MMM YYYY")}</td>
                            <td>${dateEnd.format("DD MMM YYYY")}</td>
                            <td>${timeStart}</td>
                            <td>${timeEnd}</td>
                            <td>${moment(data[i].duration, "HH:mm:s").format("HH:mm")}</td>
	                        <td>
	                            <div class="action-table">
	                                <span class="icon-pointer" onclick="javascript:appFloat.confirmEdit('${data[i].id}', '${dateStart.format("DD/MM/YYYY")}', '${dateEnd.format("DD/MM/YYYY")}', '${timeStart}', '${timeEnd}', '${data[i].title}', '${data[i].project_title}', '${data[i].project_id}');"><i class="bi bi-pencil-square edit"></i></span>
	                                <span class="icon-pointer" onclick="javascript:appFloat.confirmDelete(${data[i].id}, '${data[i].title}');"><i class="bi bi-trash-fill delete"></i></span>
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
	                        <td colspan="8">&nbsp;</td>
	                    </tr>
            	`);
        }

        table.disable_page = false;

        if( callback )
            callback(response);
    }
}
