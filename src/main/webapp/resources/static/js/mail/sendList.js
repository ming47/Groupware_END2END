
$(function () {
    let cpage = sessionStorage.getItem("page") || 1;
    $.ajax({
        url: "/mail/sendListAll",
        data: { cpage: cpage }
    }).done(function (resp) {
        let list = resp.list;
        $("#recordCount").text(resp.recordTotalCount);
        for(let i = 0; i < list.length; i++) {
            let tr = $('<tr>');
            tr.append(
                $('<td>').html('<input class="childCheckbox" style="zoom: 1.5;" type="checkbox">')
            );

            tr.append($('<td>').html(list[i].recipientemailaddress));

            if (list[i].fileCount && list[i].fileCount != 0) {
                tr.append($('<td>').html('<span class="material-icons">attachment</span>'));
            } else {
                tr.append($('<td>'));
            }
            let a = $('<span>').text(list[i].title);
            tr.append($('<td>').append(a).addClass('contents').attr('id', list[i].id));

            a.on('click', function() {
                window.location.href = '/mail/detailSent/' + list[i].id
            })

            let rawDate = list[i].regdate;
            if (typeof rawDate !== 'string') {
                rawDate = String(rawDate);
            }
            if (rawDate) {
                let isoDate = rawDate.replace(" ", "T").split(".")[0];
                let timestamp = new Date(isoDate).getTime();
                tr.append($('<td>').addClass('relative-date').attr('data-timestamp', timestamp).html(rawDate));
            } else {
                tr.append($('<td>').addClass('relative-date').html("날짜 정보 없음"));
            }
            $('.mailList').append(tr);
        }
        let pagingTr = $('<tr>');
        let pagingTd = $('<td colspan="5" style="text-align: center;">');
        if(resp.needPrev) {
            let prevSpan = $('<span>').addClass('paging').attr("page", resp.startNavi - 1).html("<");
            pagingTd.append(prevSpan);
        }
        // 페이지 번호
        for(let i = resp.startNavi; i <= resp.endNavi; i++) {
            let pageSpan = $('<span>').addClass('paging').attr("page", i).html(i);
            if (i == cpage) {
                pageSpan.addClass('active');
            }
            pagingTd.append(pageSpan);
        }
        // 다음 버튼
        if(resp.needNext) {
            let nextSpan = $('<span>').addClass('paging').attr("page", resp.endNavi + 1).html(">");
            pagingTd.append(nextSpan);
        }

        $(".pageNavi").append(pagingTd);
        $('#buttons').before(pagingTr);

        // 페이지 번호 클릭 시
        $(".paging").on("click", function() {
            let pageNum = $(this).attr("page");
            sessionStorage.setItem("page", pageNum);
            location.href = "/mail/sendList?cpage=" + pageNum;
        });
        // 상대적 날짜 표시
        let now = new Date();
        $('.relative-date').each(function(){
            let timestamp = parseInt($(this).data('timestamp'), 10);
            let postDate = new Date(timestamp);
            let diffMinutes = Math.floor((now - postDate) / (1000 * 60));

            if(diffMinutes < 1) {
                $(this).text("방금 전");
            } else if(diffMinutes < 60) {
                $(this).text(diffMinutes + "분 전");
            } else if(diffMinutes < 1440) {
                let diffHours = Math.floor(diffMinutes / 60);
                $(this).text(diffHours + "시간 전");
            } else {
                let year = postDate.getFullYear();
                let month = String(postDate.getMonth() + 1).padStart(2, '0');
                let day = String(postDate.getDate()).padStart(2, '0');
                $(this).text(year + "년 " + month + "월 " + day + "일 ");
            }
        });
    })
    $(document).on('change', '#checkAll', function() {
        let isChecked = $(this).prop('checked');
        $('table.mailList input.childCheckbox').prop('checked', isChecked);
    });
    window.addEventListener('pageshow', function (event) {
        if(event.persisted) {
            window.location.reload();
        }
    })
    $(document).on('change', '.star-checkbox', function() {
        let esId = $(this).data('esid');
        let isImportant = $(this).prop('checked') ? 'Y' : 'N';
        $.ajax({
            url: "/mail/updateImportant",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                esId: esId,
                importantYn: isImportant
            })
        }).done(function (resp) {

        });
    });
    $("#searchBtn").on("click", function() {
        const option = $("#searchOption").val().trim();
        const keyword = $("#input").val().trim().toLowerCase();

        if (!keyword) {
            $("#mailBody tr").show();
            return;
        }

        $("#mailBody tr").each(function() {
            const $row = $(this);
            let isMatch = false;
            if (option === "받는 사람") {
                const receiver = $row.find("td:eq(1)").text().toLowerCase();
                isMatch = receiver.includes(keyword);
            }
            else if (option === "제목") {
                const title = $row.find("td:eq(3)").text().toLowerCase();
                isMatch = title.includes(keyword);
            }
            $row.toggle(isMatch);
        });
    });

    $("#input").on("keypress", function(e) {
        if (e.which === 13) {
            $("#searchBtn").click();
        }
    });
});

$("#readBtn").on("click", function () {
    let esids = [];
    $('input.childCheckbox:checked').each(function () {
        let esid = $(this).closest('tr').find('input.star-checkbox').data('esid');
        if(esid !== undefined) {
            esids.push(esid);
        }
    });
    $.ajax({
        url: "/mail/readAndTrashAll?action=read",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(esids),
    }).done(function (resp) {
        window.location.reload();
    });
});

$("#trashBtn").on("click", function () {
    let esids = [];
    $('input.childCheckbox:checked').each(function () {
        let esid = $(this).closest('tr').find('input.star-checkbox').data('esid');
        if(esid !== undefined) {
            esids.push(esid);
        }
    });
    $.ajax({
        url: "/mail/readAndTrashAll?action=trash",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(esids),
    }).done(function (resp) {
        window.location.reload();
    });
});