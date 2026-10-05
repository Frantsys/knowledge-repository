package com.frantsys.knowledge_repository.modules.Material.controller;

import com.frantsys.knowledge_repository.config.SecurityConfig;
import com.frantsys.knowledge_repository.config.SecurityService;
import com.frantsys.knowledge_repository.exception.GlobalExceptionHandler;
import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialResponse;
import com.frantsys.knowledge_repository.modules.Material.service.MaterialService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Só a camada web: os serviços são mocks. O SecurityConfig e o GlobalExceptionHandler são os reais,
// então os testes exercitam autenticação, @PreAuthorize e o formato dos erros de verdade.
@WebMvcTest(MaterialController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class MaterialControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MaterialService materialService;

    @MockitoBean(name = "securityService")
    private SecurityService securityService;

    @Test
    @DisplayName("GET /materials without a token returns 401")
    void list_withoutToken_returns401() throws Exception {
        mockMvc.perform(get("/v1/api/materials"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /materials returns a page with content and paging metadata")
    void list_returnsPage() throws Exception {
        MaterialResponse response = new MaterialResponse();
        response.setId(1L);
        response.setTitle("Algebra");

        when(materialService.findAll(any()))
                .thenReturn(new PageImpl<>(List.of(response), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/v1/api/materials").with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Algebra"))
                .andExpect(jsonPath("$.page.totalElements").value(1));
    }

    @Test
    @DisplayName("GET /materials/{id} returns a 404 problem when the material does not exist")
    void findById_notFound_returns404() throws Exception {
        when(materialService.findById(99L)).thenThrow(new ResourceNotFoundException("Material não encontrado"));

        mockMvc.perform(get("/v1/api/materials/99").with(jwt()))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.detail").value("Material não encontrado"));
    }

    @Test
    @DisplayName("POST /materials with an invalid body returns 400 with field errors")
    void create_invalidBody_returns400() throws Exception {
        mockMvc.perform(post("/v1/api/materials")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "", "body": "x", "subject": "Math", "course": "Eng"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists())
                .andExpect(jsonPath("$.errors.body").exists());
    }

    @Test
    @DisplayName("POST /materials with malformed JSON returns 400, not 500")
    void create_malformedJson_returns400() throws Exception {
        mockMvc.perform(post("/v1/api/materials")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{not json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PATCH /materials/{id} by someone who is not the owner returns 403")
    void update_notOwner_returns403() throws Exception {
        when(securityService.isMaterialOwner(1L, "intruder@example.com")).thenReturn(false);

        mockMvc.perform(patch("/v1/api/materials/1")
                        .with(jwt().jwt(j -> j.subject("intruder@example.com")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "Hacked title"}
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("PATCH /materials/{id} by the owner returns 200")
    void update_owner_returns200() throws Exception {
        when(securityService.isMaterialOwner(1L, "anna@example.com")).thenReturn(true);
        when(materialService.updateById(any(), any())).thenReturn(new MaterialResponse());

        mockMvc.perform(patch("/v1/api/materials/1")
                        .with(jwt().jwt(j -> j.subject("anna@example.com")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "New title"}
                                """))
                .andExpect(status().isOk());

        verify(materialService).updateById(any(), any());
    }

    @Test
    @DisplayName("PATCH /materials/{id} by an admin returns 200 without being the owner")
    void update_admin_returns200() throws Exception {
        when(materialService.updateById(any(), any())).thenReturn(new MaterialResponse());

        mockMvc.perform(patch("/v1/api/materials/1")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "Moderated title"}
                                """))
                .andExpect(status().isOk());
    }

}
