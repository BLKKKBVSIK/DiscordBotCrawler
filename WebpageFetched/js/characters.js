//console.log("oui");
function drawCharacters() {
    function t() {
        function t(t) {
            function a(t, a, n, s) {
                t.drawImage(e, n * r, a, r, r, s * r, 0, r, r)
            }

            function n(e, n) {
                l.globalCompositeOperation = "source-over", d.clearRect(0, 0, r, r), l.clearRect(0, 0, r, r), a(l, g, n, 0), o(e),
                    l.globalCompositeOperation = "source-in", l.save(), l.translate(1 + (r - 42) / 2, 1 + (r - 42)), l.fillRect(0, 0, r, r), l.restore(), a(d, g, n + 1, 0),
                    d.drawImage(h, 0, 0, r, r, 0, 0, r, r), c.drawImage(i, 0, 0, r, r, t.offset * r, 0, r, r)
            }

            function o(t) {
                if (!s[t]) {
                    16777216 > t && (t <<= 20);
                    var a = t >> 24,
                        n = 16777215 & t;
                    1 === a ? s[t] = "#" + ("00000" + n.toString(16)).slice(-6) : (u = u || document.createElement("canvas"), f = f || u.getContext("2d"), u.width = u.height = a, f.clearRect(0, 0, a, a), f.drawImage(e, (15 & n) * a, sheetOffsets[a] + (n >> 4) * a, a, a, 0, 0, a, a), s[t] = f.createPattern(u, "repeat"))
                }
                l.fillStyle = s[t]
            }
            if (t.data["class"]) {
                var u, f, m = classInfoById[t.data["class"]],
                    p = _.detect(m[6], function(e) {
                        return e[0] == t.data.skin
                    }) || m[6][0],
                    g = p[2] * r;
                a(c, g, 0, t.offset), t.data.dye1 && n(t.data.dye1, 1), t.data.dye2 && n(t.data.dye2, 3)
            }
        }
        var a = 0,
            n = {},
            s = {},
            r = 50,
            o = document.createElement("canvas"),
            c = o.getContext("2d"),
            i = document.createElement("canvas"),
            d = i.getContext("2d"),
            h = document.createElement("canvas"),
            l = h.getContext("2d");
        $(".character").each(function() {
            var t = $(this).data(),
                e = _.map(["class", "skin", "dye1", "dye2"], function(e) {
                    return t[e]
                }).join(".");
            n[e] ? n[e].elements.push(this) : (n[e] = {
                data: t,
                offset: a,
                elements: [this]
            }, a++)
        }), o.height = i.height = i.width = h.height = i.width = r, o.width = r * a, _.each(n,
            function(e) {
                t(e)
            });
        var u = [];
        u.push("<style>.character{background-image:url("),
            u.push(o.toDataURL()),
            $('#playerBackground').text(o.toDataURL())

            //console.log(o.toDataURL())
            ,
            u.push(")}"), _.each(n, function(t) {
                _.each(t.elements, function(e) {
                    u.push("#"), u.push(e.id), u.push("{background-position:"), u.push(-r * t.offset), u.push("px 0 !important}\n")
                })
            }), u.push("</style>"),


            $("head").append(u.join(""))
    }
    var e = new Image;
    e.onload = t, e.src = sheetSrc
}

function makePortraitPopovers(t) {
    $("#" + t + " .character").each(function() {
        var t = $(this),
            e = classInfoById[parseInt(t.data("class"))],
            a = parseInt(t.data("skin")),
            n = _.detect(e[6], function(t) {
                return t[0] == a
            });
        t.popover({
            html: !0,
            content: makeCharacterDyeTable(t),
            placement: function(t, e) {
                var a = $(e).offset().top - $(window).scrollTop();
                return 200 > a ? "bottom" : "top"
            },
            trigger: "hover",
            title: e[1] + " - " + n[1]
        })
    })
}

function makeCharacterDyeTable(t) {
    function e(t) {
        "0" != t && (a += items[t] ? '<tr><td><span class="item" data-item="' + t + '"></span></td><td>' + items[t][0] + "</td></tr>" : '<tr><td><span class="item" data-item="-1"></span></td><td>This dye is not available in the game anymore</td></tr>')
    }
    var a = '<table class="character-dyes">',
        n = t.data("class"),
        s = t.data("accessory-dye-id"),
        r = t.data("clothing-dye-id"),
        o = parseInt(t.data("count")),
        c = classInfoById[n];
    return e(s), e(r), a += '<tr><td colspan="2">', a += 1 == o ? "The only " + c[1] + " with this outfit." : 2 == o ? "There is another " + c[1] + " with this outfit." : "There are " + (o - 1) + " other " + c[2] + " with this outfit.", a += "</td></tr>", a += "</table>", a = $(a), makeItemsIn(a), a
}

function pluralOfClass(t) {
    return "Huntress" == t ? "Huntresses" : t + "s"
}