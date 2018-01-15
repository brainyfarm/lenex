require 'net/http'

def new_user(ref, i)
    user = {
        username: "user#{i}",
        password: "password#{i}",
        email: "user#{i}@gmail.com",
        fullName: "User #{i}",
        referer: "user#{ref}",
        countryId: 1,
        phone: "123",
    }
    if ref < 0 then
        user.delete(:referer)
    end
    user
end

def register(ref, i)
    Net::HTTP.post_form(URI.parse('http://a.b:3000/create-user'), new_user(ref, i))
end

register(-1, 0)
register(0, 1)
register(0, 2)
register(0, 3)
